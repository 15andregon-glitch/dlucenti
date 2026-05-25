import { calculateShipping } from "@/lib/shipping/calculate";
import { eurosToStripeCents } from "@/lib/prices";
import type { Locale } from "@/lib/i18n/locale";

type CheckoutShippingOption = {
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

function shippingRateData(
  displayName: string,
  shippingCostEur: number,
  currency: string,
): CheckoutShippingOption {
  return {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: displayName,
      fixed_amount: {
        amount: eurosToStripeCents(shippingCostEur),
        currency: currency.toLowerCase(),
      },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 3 },
        maximum: { unit: "business_day", value: 7 },
      },
    },
  };
}

/**
 * Stripe Checkout shipping_options — zone rates from merchandise subtotal.
 * Final selection happens on Stripe after the customer enters their address.
 */
export function buildStripeCheckoutShippingOptions(
  subtotal: number,
  currency: string,
  locale: Locale,
): CheckoutShippingOption[] {
  const ptQuote = calculateShipping("PT", subtotal, currency);
  const euQuote = calculateShipping("FR", subtotal, currency);

  const ptLabel =
    locale === "pt"
      ? ptQuote.isFreeShipping
        ? "Portugal — incluído"
        : "Portugal"
      : ptQuote.isFreeShipping
        ? "Portugal — included"
        : "Portugal";

  const euLabel =
    locale === "pt"
      ? euQuote.isFreeShipping
        ? "Europa — incluído"
        : "Europa"
      : euQuote.isFreeShipping
        ? "Europe — included"
        : "Europe";

  return [
    shippingRateData(ptLabel, ptQuote.shippingCost, currency),
    shippingRateData(euLabel, euQuote.shippingCost, currency),
  ];
}
