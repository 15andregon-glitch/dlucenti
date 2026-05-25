import type Stripe from "stripe";
import { normalizeShippingCountry } from "@/lib/shipping/calculate";

type SessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: {
    address?: Stripe.Address | null;
  } | null;
};

export function extractShippingCountryFromSession(
  session: Stripe.Checkout.Session,
): string {
  const extended = session as SessionWithShipping;
  const fromAddress =
    extended.shipping_details?.address?.country ??
    session.customer_details?.address?.country ??
    session.metadata?.shipping_country;

  return normalizeShippingCountry(fromAddress);
}
