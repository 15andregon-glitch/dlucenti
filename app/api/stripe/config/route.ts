import { NextResponse } from "next/server";
import { getStripePublishableKey } from "@/lib/stripe/config";

export const runtime = "nodejs";

/**
 * Returns the Stripe publishable key at runtime so Embedded Checkout works
 * even when NEXT_PUBLIC_* was added after the last client bundle build.
 */
export async function GET() {
  try {
    const publishableKey = getStripePublishableKey();
    return NextResponse.json({ publishableKey });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe is not configured";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
