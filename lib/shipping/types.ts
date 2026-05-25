/** ISO 3166-1 alpha-2 */
export type ShippingCountryCode = string;

export interface ShippingQuoteInput {
  country: ShippingCountryCode;
  subtotal: number;
  currency?: string;
}

export interface ShippingQuote {
  providerId: string;
  country: ShippingCountryCode;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  freeShippingThreshold: number | null;
  amountUntilFreeShipping: number | null;
  isFreeShipping: boolean;
}
