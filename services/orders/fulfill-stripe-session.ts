import "server-only";

import type Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ValidatedCheckoutLine } from "@/lib/checkout/types";

interface CartMetadataLine {
  productId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  name: string;
}

function parseCartMetadata(raw: string | undefined): CartMetadataLine[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CartMetadataLine[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.filter(
      (l) =>
        l.productId &&
        Number.isFinite(l.quantity) &&
        l.quantity > 0 &&
        typeof l.name === "string",
    );
  } catch {
    return null;
  }
}

function generateOrderNumber(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DLU-${stamp}-${suffix}`;
}

export async function fulfillStripeCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ orderId: string; created: boolean }> {
  const sessionId = session.id;
  if (!sessionId) {
    throw new Error("Missing Stripe session id");
  }

  const client = createSupabaseAdminClient();

  const { data: existing } = await client
    .from("orders")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existing?.id) {
    console.info("[stripe/webhook] order already exists", sessionId);
    return { orderId: existing.id, created: false };
  }

  const metadataLines = parseCartMetadata(session.metadata?.cart);
  if (!metadataLines) {
    throw new Error("Missing cart metadata on checkout session");
  }

  const amountTotal = (session.amount_total ?? 0) / 100;
  const subtotal = metadataLines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const currency = (session.currency ?? "eur").toUpperCase();

  const customerEmail =
    session.customer_details?.email ??
    session.customer_email ??
    null;
  const customerName = session.customer_details?.name ?? null;

  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "paid",
      subtotal,
      shipping_cost: Math.max(0, amountTotal - subtotal),
      tax: 0,
      total: amountTotal,
      currency,
      stripe_session_id: sessionId,
      stripe_payment_intent: paymentIntent,
      customer_email: customerEmail,
      customer_name: customerName,
      synced_to_finance: false,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[stripe/webhook] order insert failed", orderError?.message);
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  const orderItems = metadataLines.map((line) => ({
    order_id: order.id,
    product_id: line.productId,
    product_name: line.name,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    unit_cost: line.unitCost,
  }));

  const { error: itemsError } = await client.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("[stripe/webhook] order_items insert failed", itemsError.message);
    throw new Error(itemsError.message);
  }

  for (const line of metadataLines) {
    const { error: stockError } = await client.rpc("decrement_product_stock", {
      p_product_id: line.productId,
      p_quantity: line.quantity,
    });

    if (stockError) {
      console.error(
        "[stripe/webhook] stock decrement failed",
        line.productId,
        stockError.message,
      );
      throw new Error(stockError.message);
    }
  }

  console.info("[stripe/webhook] order fulfilled", {
    orderId: order.id,
    sessionId,
    orderNumber,
  });

  return { orderId: order.id, created: true };
}

export type { CartMetadataLine };
