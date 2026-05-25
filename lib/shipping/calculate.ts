import { DEFAULT_SHIPPING_COUNTRY } from "@/lib/shipping/constants";
import { fixedPortugalShippingProvider } from "@/lib/shipping/providers/fixed-portugal";
import type { ShippingRateProvider } from "@/lib/shipping/providers/types";
import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";

const defaultProvider: ShippingRateProvider = fixedPortugalShippingProvider;

export function normalizeShippingCountry(
  code: string | null | undefined,
): string {
  const raw = (code ?? DEFAULT_SHIPPING_COUNTRY).trim().toUpperCase();
  return raw.length === 2 ? raw : DEFAULT_SHIPPING_COUNTRY;
}

/** Resolve shipping for checkout — swap provider when carrier APIs are integrated */
export function calculateShipping(
  country: string | null | undefined,
  subtotal: number,
  currency = "EUR",
): ShippingQuote {
  const input: ShippingQuoteInput = {
    country: normalizeShippingCountry(country),
    subtotal,
    currency,
  };
  return defaultProvider.quote(input);
}
