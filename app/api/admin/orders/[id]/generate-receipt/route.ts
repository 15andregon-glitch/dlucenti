import { NextResponse } from "next/server";
import { buildPackingReceiptPdf } from "@/lib/admin/packing-receipt";
import { getAdminSession } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getOrderAdmin, updateOrderAdmin } from "@/services/supabase/admin-orders";

async function ensureBucket(name: string) {
  const client = createSupabaseAdminClient();
  const { data: buckets, error: listError } = await client.storage.listBuckets();
  if (listError) throw new Error(`Failed to list storage buckets: ${listError.message}`);
  const exists = (buckets ?? []).some((b) => b.name === name);
  if (exists) return;
  const { error } = await client.storage.createBucket(name, { public: false });
  if (error) throw new Error(`Failed to create storage bucket "${name}": ${error.message}`);
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const order = await getOrderAdmin(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (!order.shipping_address) {
      return NextResponse.json(
        { error: "Missing shipping address for receipt generation." },
        { status: 400 },
      );
    }

    const items = order.order_items ?? [];
    const productIds = items
      .map((item) => item.product_id)
      .filter((value): value is string => Boolean(value));

    const client = createSupabaseAdminClient();
    const { data: products, error: productsError } = productIds.length
      ? await client.from("products").select("id, sku").in("id", productIds)
      : { data: [], error: null };
    if (productsError) {
      throw new Error(`Failed to load product SKUs: ${productsError.message}`);
    }
    const skuById = new Map((products ?? []).map((p) => [p.id, p.sku ?? "—"]));

    const pdfBytes = await buildPackingReceiptPdf({
      orderNumber: order.order_number,
      orderDateIso: order.created_at,
      customerName: order.customer_name ?? "Customer",
      shippingAddress: order.shipping_address,
      shippingMethod: order.shipping_service_name ?? "Standard Shipping",
      currency: order.currency,
      subtotal: Number(order.subtotal),
      customerShippingPaid: Number(order.customer_shipping_paid ?? order.shipping_cost),
      totalPaid: Number(order.total),
      items: items.map((item) => ({
        name: item.product_name,
        sku: (item.product_id && skuById.get(item.product_id)) || "—",
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
      })),
    });

    await ensureBucket("receipts");
    const path = `orders/${order.order_number}/receipt.pdf`;
    const { error: uploadError } = await client.storage
      .from("receipts")
      .upload(path, pdfBytes, {
        upsert: true,
        contentType: "application/pdf",
      });
    if (uploadError) {
      throw new Error(`Receipt upload failed: ${uploadError.message}`);
    }

    const storagePath = `receipts/${path}`;
    await updateOrderAdmin(order.id, {
      receipt_pdf_url: storagePath,
      receipt_generated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      receiptUrl: storagePath,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate packing receipt";
    console.error("[admin/orders/generate-receipt]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
