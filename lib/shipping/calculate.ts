import { DEFAULT_SHIPPING_COUNTRY } from "@/lib/shipping/constants";
import { fixedRegionalShippingProvider } from "@/lib/shipping/providers/fixed-regional";
import type { ShippingRateProvider } from "@/lib/shipping/providers/types";
import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";

/** Sync fallback (Portugal only). Live quotes use Packlink via quoteShippingForDestination. */
const defaultProvider: ShippingRateProvider = fixedRegionalShippingProvider;

export function normalizeShippingCountry(
  code: string | null | undefined,
): string {
  const raw = (code ?? DEFAULT_SHIPPING_COUNTRY).trim().toUpperCase();
  return raw.length === 2 ? raw : DEFAULT_SHIPPING_COUNTRY;
}

/** Resolve shipping from delivery country + merchandise subtotal */
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
