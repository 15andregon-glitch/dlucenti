import {
  EUROPE_FREE_SHIPPING_THRESHOLD_EUR,
  EUROPE_SHIPPING_COST_EUR,
  isPortugalShippingCountry,
  PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR,
  PORTUGAL_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";
import { roundMoney } from "@/lib/prices";
import type { ShippingRateProvider } from "@/lib/shipping/providers/types";

function quotePortugal(subtotal: number, country: string, currency: string): ShippingQuote {
  const threshold = PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR;
  const isFreeShipping = subtotal >= threshold;
  const shippingCost = isFreeShipping ? 0 : roundMoney(PORTUGAL_SHIPPING_COST_EUR);
  const amountUntilFreeShipping = isFreeShipping
    ? 0
    : roundMoney(Math.max(0, threshold - subtotal));

  return {
    providerId: "fixed-regional",
    country,
    subtotal,
    shippingCost,
    total: roundMoney(subtotal + shippingCost),
    currency,
    freeShippingThreshold: threshold,
    amountUntilFreeShipping,
    isFreeShipping,
  };
}

function quoteEurope(subtotal: number, country: string, currency: string): ShippingQuote {
  const threshold = EUROPE_FREE_SHIPPING_THRESHOLD_EUR;
  const isFreeShipping = subtotal >= threshold;
  const shippingCost = isFreeShipping ? 0 : roundMoney(EUROPE_SHIPPING_COST_EUR);
  const amountUntilFreeShipping = isFreeShipping
    ? 0
    : roundMoney(Math.max(0, threshold - subtotal));

  return {
    providerId: "fixed-regional",
    country,
    subtotal,
    shippingCost,
    total: roundMoney(subtotal + shippingCost),
    currency,
    freeShippingThreshold: threshold,
    amountUntilFreeShipping,
    isFreeShipping,
  };
}

/**
 * Fixed regional rates (Portugal + Europe thresholds).
 * Replace or chain with Packlink / Sendcloud providers later.
 */
export const fixedRegionalShippingProvider: ShippingRateProvider = {
  id: "fixed-regional",

  quote(input: ShippingQuoteInput): ShippingQuote {
    const country = input.country.toUpperCase();
    const subtotal = roundMoney(input.subtotal);
    const currency = input.currency ?? "EUR";

    if (isPortugalShippingCountry(country)) {
      return quotePortugal(subtotal, country, currency);
    }

    return quoteEurope(subtotal, country, currency);
  },
};
