import {
  freeShippingThresholdForCountry,
  isPortugalShippingCountry,
  PORTUGAL_FALLBACK_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";
import { roundMoney } from "@/lib/prices";
import type { ShippingRateProvider } from "@/lib/shipping/providers/types";

/**
 * Sync fallback for Portugal when Packlink is unavailable.
 * Europe paid rates are not hardcoded — use Packlink via quoteShippingForDestination.
 */
export const fixedRegionalShippingProvider: ShippingRateProvider = {
  id: "fixed-regional",

  quote(input: ShippingQuoteInput): ShippingQuote {
    const country = input.country.toUpperCase();
    const subtotal = roundMoney(input.subtotal);
    const currency = input.currency ?? "EUR";
    const threshold = freeShippingThresholdForCountry(country);
    const isFreeShipping = subtotal >= threshold;

    let shippingCost = 0;
    if (!isFreeShipping && isPortugalShippingCountry(country)) {
      shippingCost = roundMoney(PORTUGAL_FALLBACK_SHIPPING_COST_EUR);
    }

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
  },
};
