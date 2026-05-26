import "server-only";

/**
 * Stripe hosted redirect Checkout cannot recalculate shipping after the customer
 * enters their address. We use Embedded Checkout with
 * permissions.update_shipping_details = server_only and Packlink quotes on
 * POST /api/stripe/checkout/shipping when the address is complete.
 *
 * The cart never shows estimated shipping — only this flow sets the paid amount.
 */

import { eurosToStripeCents } from "@/lib/prices";
import type { Locale } from "@/lib/i18n/locale";
import type { DestinationShippingQuote } from "@/lib/shipping/quote-destination";

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

export function buildStripeShippingOptionFromQuote(
  quote: DestinationShippingQuote,
  locale: Locale,
): StripeSessionShippingOption {
  const displayName = shippingDisplayName(quote, locale);

  return {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: displayName,
      fixed_amount: {
        amount: eurosToStripeCents(quote.shippingCost),
        currency: quote.currency.toLowerCase(),
      },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 3 },
        maximum: { unit: "business_day", value: 10 },
      },
    },
  };
}

function shippingDisplayName(quote: DestinationShippingQuote, locale: Locale): string {
  if (quote.isFreeShipping) {
    return locale === "pt" ? "Envio incluído" : "Shipping included";
  }

  if (quote.carrierName && quote.serviceName) {
    return `${quote.carrierName} — ${quote.serviceName}`;
  }

  if (quote.carrierName) {
    return quote.carrierName;
  }

  return locale === "pt" ? "Envio standard" : "Standard shipping";
}
