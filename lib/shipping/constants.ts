/** Portugal free-shipping threshold (EUR) */
export const PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR = 50;

/** Europe (non-PT) free-shipping threshold (EUR) */
export const EUROPE_FREE_SHIPPING_THRESHOLD_EUR = 80;

/** Fallback paid shipping when Packlink is unavailable (Portugal only) */
export const PORTUGAL_FALLBACK_SHIPPING_COST_EUR = 4.9;

export const DEFAULT_SHIPPING_COUNTRY = "PT";

export const PORTUGAL_COUNTRY_CODE = "PT";

/** Default parcel for Packlink quotes */
export const DEFAULT_PACKAGE_WEIGHT_KG = 0.3;

export const DEFAULT_PACKAGE_DIMENSIONS_CM = {
  length: 15,
  width: 10,
  height: 5,
} as const;

/** Matches Stripe Checkout allowed_countries */
export const CHECKOUT_SHIPPING_COUNTRIES = [
  "PT",
  "ES",
  "FR",
  "IT",
  "DE",
  "GB",
  "US",
  "CH",
  "BE",
  "NL",
] as const;

export type CheckoutShippingCountry = (typeof CHECKOUT_SHIPPING_COUNTRIES)[number];

export function isPortugalShippingCountry(country: string): boolean {
  return country.toUpperCase() === PORTUGAL_COUNTRY_CODE;
}

export function freeShippingThresholdForCountry(country: string): number {
  return isPortugalShippingCountry(country)
    ? PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR
    : EUROPE_FREE_SHIPPING_THRESHOLD_EUR;
}
