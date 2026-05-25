import type Stripe from "stripe";

/** Stripe Session may include shipping_details at runtime; types vary by API version */
type SessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: {
    name?: string | null;
    address?: Stripe.Address | null;
  } | null;
};

function formatStripeAddress(
  address: Stripe.Address | null | undefined,
  name?: string | null,
): string | null {
  if (!address?.line1 && !address?.city && !address?.country) {
    return name?.trim() || null;
  }

  const cityLine = [address.postal_code, address.city]
    .filter(Boolean)
    .join(" ")
    .trim();

  const lines = [
    name?.trim(),
    address.line1?.trim(),
    address.line2?.trim(),
    cityLine || undefined,
    address.state?.trim(),
    address.country?.trim(),
  ].filter((line): line is string => Boolean(line));

  return lines.length > 0 ? lines.join("\n") : null;
}

/** Prefer Stripe shipping details; fall back to customer billing address */
export function formatShippingAddressFromSession(
  session: Stripe.Checkout.Session,
): string | null {
  const shipping = (session as SessionWithShipping).shipping_details;
  if (shipping?.address) {
    return formatStripeAddress(shipping.address, shipping.name);
  }

  const customer = session.customer_details;
  if (customer?.address) {
    return formatStripeAddress(customer.address, customer.name);
  }

  return session.customer_details?.name?.trim() ?? null;
}
