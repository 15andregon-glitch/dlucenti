import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getStripe } from "@/lib/stripe/config";
import {
  createPacklinkShipment,
  fetchPacklinkLabelDocument,
} from "@/lib/shipping/packlink-shipments";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getOrderAdmin, updateOrderAdmin } from "@/services/supabase/admin-orders";

type StripeSessionWithShipping = {
  customer_details?: {
    email?: string | null;
    phone?: string | null;
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
  shipping_details?: {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
};

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
    if (!order.stripe_session_id) {
      return NextResponse.json(
        { error: "Missing Stripe session id on order" },
        { status: 400 },
      );
    }
    if (!order.packlink_service_id) {
      return NextResponse.json(
        { error: "Invalid shipping service. Missing Packlink service id." },
        { status: 400 },
      );
    }
    if (order.free_shipping_applied) {
      if (!order.selected_free_shipping_service || !order.selected_free_shipping_carrier) {
        return NextResponse.json(
          { error: "Invalid free-shipping service configuration on order." },
          { status: 400 },
        );
      }
    } else if (!order.shipping_service_name) {
      return NextResponse.json(
        { error: "Missing customer-selected shipping service on order." },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const session = (await stripe.checkout.sessions.retrieve(
      order.stripe_session_id,
    )) as StripeSessionWithShipping;

    const shipping = session.shipping_details?.address ?? session.customer_details?.address;
    const recipientName =
      session.shipping_details?.name ??
      session.customer_details?.name ??
      order.customer_name ??
      "";

    if (
      !recipientName ||
      !shipping?.line1 ||
      !shipping?.city ||
      !shipping?.postal_code ||
      !shipping?.country
    ) {
      return NextResponse.json(
        { error: "Missing address data. Add complete shipping address first." },
        { status: 400 },
      );
    }

    const shipment = await createPacklinkShipment({
      orderNumber: order.order_number,
      serviceId: order.packlink_service_id,
      recipient: {
        name: recipientName,
        email: session.customer_details?.email ?? order.customer_email,
        phone: session.customer_details?.phone ?? null,
        country: shipping.country,
        postalCode: shipping.postal_code,
        city: shipping.city,
        state: shipping.state ?? null,
        addressLine1: shipping.line1,
        addressLine2: shipping.line2 ?? null,
      },
    });

    let labelUrl = shipment.labelUrl;

    // If Packlink does not return a hosted URL directly, try fetching label content.
    if (!labelUrl) {
      const label = await fetchPacklinkLabelDocument(shipment.shipmentId);
      if (label.url) {
        labelUrl = label.url;
      } else if (label.pdfBytes) {
        await ensureBucket("shipping-labels");
        const client = createSupabaseAdminClient();
        const path = `orders/${order.order_number}/label.pdf`;
        const { error: uploadError } = await client.storage
          .from("shipping-labels")
          .upload(path, label.pdfBytes, {
            upsert: true,
            contentType: "application/pdf",
          });
        if (uploadError) {
          throw new Error(`Label upload failed: ${uploadError.message}`);
        }
        labelUrl = `shipping-labels/${path}`;
      }
    }

    if (!labelUrl) {
      return NextResponse.json(
        { error: "Carrier label retrieval failed." },
        { status: 502 },
      );
    }

    await updateOrderAdmin(order.id, {
      packlink_shipment_id: shipment.shipmentId,
      packlink_tracking_number: shipment.trackingNumber,
      packlink_tracking_url: shipment.trackingUrl,
      packlink_label_url: labelUrl,
      packlink_label_generated_at: new Date().toISOString(),
      shipping_status: shipment.status ?? "label_generated",
      tracking_number: shipment.trackingNumber ?? order.tracking_number,
      tracking_url: shipment.trackingUrl ?? order.tracking_url,
      label_url: labelUrl,
      courier: order.courier ?? order.selected_free_shipping_carrier,
    });

    return NextResponse.json({
      ok: true,
      shipmentId: shipment.shipmentId,
      trackingNumber: shipment.trackingNumber,
      trackingUrl: shipment.trackingUrl,
      labelUrl,
      shippingStatus: shipment.status ?? "label_generated",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate shipping label";
    console.error("[admin/orders/generate-label]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
