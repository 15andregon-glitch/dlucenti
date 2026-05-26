import "server-only";

import type Stripe from "stripe";
import { formatShippingAddressFromSession } from "@/lib/emails/format-shipping-address";
import type { OrderEmailPayload } from "@/lib/emails/order-email-types";
import { DEFAULT_LOCALE, isValidLocale, type Locale } from "@/lib/i18n/locale";
import { roundMoney } from "@/lib/prices";
import { extractShippingCountryFromSession } from "@/lib/shipping/session-country";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendOrderEmails } from "@/services/emails/send-order-emails";

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

function parseMetadataMoney(raw: string | undefined): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? roundMoney(n) : null;
}

function generateOrderNumber(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DLU-${stamp}-${suffix}`;
}

function localeFromSession(session: Stripe.Checkout.Session): Locale {
  const raw = session.metadata?.locale;
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

function resolveOrderAmounts(
  session: Stripe.Checkout.Session,
  metadataLines: CartMetadataLine[],
): {
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingCountry: string;
} {
  const linesSubtotal = roundMoney(
    metadataLines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    ),
  );

  const metaSubtotal =
    parseMetadataMoney(session.metadata?.subtotal) ?? linesSubtotal;
  const metaShipping = parseMetadataMoney(session.metadata?.shipping_cost);

  const shippingCountry = extractShippingCountryFromSession(session);
  const amountTotal = roundMoney((session.amount_total ?? 0) / 100);
  const subtotal = metaSubtotal;
  const paidShipping =
    metaShipping != null ? metaShipping : roundMoney(amountTotal - subtotal);
  const total = amountTotal;

  if (metaShipping != null && Math.abs(metaShipping - paidShipping) > 0.01) {
    console.warn("[stripe/webhook] metadata shipping_cost mismatch", {
      sessionId: session.id,
      metaShipping,
      paidShipping,
    });
  }

  return {
    subtotal,
    shippingCost: paidShipping,
    total,
    shippingCountry,
  };
}

function buildEmailPayload(
  session: Stripe.Checkout.Session,
  order: { id: string },
  orderNumber: string,
  metadataLines: CartMetadataLine[],
  subtotal: number,
  shippingCost: number,
  total: number,
  currency: string,
  customerEmail: string | null,
  customerName: string | null,
): OrderEmailPayload {
  return {
    locale: localeFromSession(session),
    orderId: order.id,
    orderNumber,
    customerEmail,
    customerName,
    shippingAddress: formatShippingAddressFromSession(session),
    currency,
    subtotal,
    shippingCost,
    total,
    items: metadataLines.map((line) => ({
      name: line.name,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      lineTotal: line.unitPrice * line.quantity,
    })),
  };
}

export async function fulfillStripeCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ orderId: string; created: boolean }> {
  const sessionId = session.id;
  if (!sessionId) {
    throw new Error("Missing Stripe session id");
  }

  if (session.payment_status !== "paid") {
    throw new Error(
      `Checkout session ${sessionId} is not paid (status: ${session.payment_status ?? "unknown"})`,
    );
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

  const { subtotal, shippingCost, total, shippingCountry } =
    resolveOrderAmounts(session, metadataLines);
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
  const packlinkServiceId = session.metadata?.packlink_service_id?.trim() || null;
  const courierName = session.metadata?.courier_name?.trim() || null;

  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "paid",
      fulfillment_status: "unfulfilled",
      subtotal,
      shipping_cost: shippingCost,
      tax: 0,
      total,
      currency,
      shipping_country: shippingCountry,
      packlink_service_id: packlinkServiceId,
      courier: courierName,
      stripe_session_id: sessionId,
      stripe_payment_intent: paymentIntent,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: formatShippingAddressFromSession(session),
      locale: localeFromSession(session),
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
    shippingCountry,
    shippingCost,
  });

  const emailPayload = buildEmailPayload(
    session,
    order,
    orderNumber,
    metadataLines,
    subtotal,
    shippingCost,
    total,
    currency,
    customerEmail,
    customerName,
  );

  await sendOrderEmails(emailPayload);

  return { orderId: order.id, created: true };
}

export type { CartMetadataLine };