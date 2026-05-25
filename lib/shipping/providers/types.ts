import type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";

/** Pluggable shipping rate source (Packlink, Sendcloud, etc.) */
export interface ShippingRateProvider {
  readonly id: string;
  quote(input: ShippingQuoteInput): ShippingQuote;
}
