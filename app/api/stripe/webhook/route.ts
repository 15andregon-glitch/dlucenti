import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { fulfillStripeCheckoutSession } from "@/services/orders/fulfill-stripe-session";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("[stripe/webhook] signature verification failed", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await fulfillStripeCheckoutSession(session);
      } else {
        console.warn(
          "[stripe/webhook] session completed but not paid",
          session.id,
          session.payment_status,
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("[stripe/webhook] handler error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
