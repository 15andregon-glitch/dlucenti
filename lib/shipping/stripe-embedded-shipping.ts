import "server-only";

/**
 * Stripe hosted redirect Checkout cannot recalculate shipping after the customer
 * enters their address. We use Embedded Checkout with server-only shipping updates
 * and Packlink quotes on POST /api/stripe/checkout/shipping.
 *
 * Pickup points: Packlink returns parcel-shop services (delivery_to_parcelshop) and
 * nearby dropoffs. Stripe shows each option as a shipping method label — there is
 * no embedded Packlink point picker. Customers choose a listed pickup location;
 * admins can adjust or assign dropoffs when creating labels in Packlink PRO.
 *
 * The cart never shows estimated shipping — only this flow sets the paid amount.
 */

import { eurosToStripeCents } from "@/lib/prices";
import type { CheckoutShippingOffer } from "@/lib/shipping/checkout-shipping-offers";

export type StripeSessionShippingOption = {
  shipping_rate_data: {
    type: "fixed_amount";
    display_name: string;
    fixed_amount: { amount: number; currency: string };
    delivery_estimate: {
      minimum: { unit: "business_day"; value: number };
      maximum: { unit: "business_day"; value: number };
    };
  };
};

/** Placeholder rate until the customer completes their address (updated server-side). */
export function buildPlaceholderStripeShippingOption(
  currency: string,
): StripeSessionShippingOption {
  return {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: "Shipping",
      fixed_amount: {
        amount: 0,
        currency: currency.toLowerCase(),
      },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 3 },
        maximum: { unit: "business_day", value: 10 },
      },
    },
  };
}

export function buildStripeShippingOptionsFromOffers(
  offers: CheckoutShippingOffer[],
): StripeSessionShippingOption[] {
  return offers.map((offer) => ({
    shipping_rate_data: {
      type: "fixed_amount" as const,
      display_name: offer.stripeDisplayName,
      fixed_amount: {
        amount: eurosToStripeCents(offer.shippingCost),
        currency: offer.currency.toLowerCase(),
      },
      delivery_estimate: {
        minimum: { unit: "business_day" as const, value: 3 },
        maximum: { unit: "business_day" as const, value: 10 },
      },
    },
  }));
}
