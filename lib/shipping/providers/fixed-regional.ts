import {
  EUROPE_FLAT_SHIPPING_EUR,
  isPortugalShippingCountry,
  PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR,
  PORTUGAL_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";
import { roundMoney } from "@/lib/prices";
import type { ShippingRateProvider } from "@/lib/shipping/providers/types";

/**
 * Fixed regional rates (Portugal threshold + Europe flat).
 * Replace or chain with Packlink / Sendcloud providers later.
 */
export const fixedRegionalShippingProvider: ShippingRateProvider = {
  id: "fixed-regional",

  quote(input: ShippingQuoteInput): ShippingQuote {
    const country = input.country.toUpperCase();
    const subtotal = roundMoney(input.subtotal);
    const currency = input.currency ?? "EUR";

    if (isPortugalShippingCountry(country)) {
      const threshold = PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR;
      const isFreeShipping = subtotal >= threshold;
      const shippingCost = isFreeShipping
        ? 0
        : roundMoney(PORTUGAL_SHIPPING_COST_EUR);
      const amountUntilFreeShipping = isFreeShipping
        ? 0
        : roundMoney(Math.max(0, threshold - subtotal));

      return {
        providerId: this.id,
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

    const shippingCost = roundMoney(EUROPE_FLAT_SHIPPING_EUR);

    return {
      providerId: this.id,
      country,
      subtotal,
      shippingCost,
      total: roundMoney(subtotal + shippingCost),
      currency,
      freeShippingThreshold: null,
      amountUntilFreeShipping: null,
      isFreeShipping: false,
    };
  },
};
