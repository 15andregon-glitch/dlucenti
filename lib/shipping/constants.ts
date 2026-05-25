/** Portugal free-shipping threshold (EUR) */
export const PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR = 50;

/** Portugal paid shipping below threshold (EUR) */
export const PORTUGAL_SHIPPING_COST_EUR = 4.9;

export const DEFAULT_SHIPPING_COUNTRY = "PT";

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
