import {
  PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR,
  PORTUGAL_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";
import { roundMoney } from "@/lib/prices";
import type { ShippingRateProvider } from "@/lib/shipping/providers/types";

/**
 * Fixed Portugal threshold shipping.
 * Replace or compose with Packlink/Sendcloud providers later.
 */
export const fixedPortugalShippingProvider: ShippingRateProvider = {
  id: "fixed-portugal",

  quote(input: ShippingQuoteInput): ShippingQuote {
    const country = input.country.toUpperCase();
    const subtotal = roundMoney(input.subtotal);
    const currency = input.currency ?? "EUR";

    if (country !== "PT") {
      return {
        providerId: this.id,
        country,
        subtotal,
        shippingCost: 0,
        total: subtotal,
        currency,
        freeShippingThreshold: null,
        amountUntilFreeShipping: null,
        isFreeShipping: true,
      };
    }

    const threshold = PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR;
    const isFreeShipping = subtotal >= threshold;
    const shippingCost = isFreeShipping ? 0 : roundMoney(PORTUGAL_SHIPPING_COST_EUR);
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
  },
};
