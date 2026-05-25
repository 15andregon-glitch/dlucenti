export {
  CHECKOUT_SHIPPING_COUNTRIES,
  DEFAULT_SHIPPING_COUNTRY,
  PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR,
  PORTUGAL_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
export { calculateShipping, normalizeShippingCountry } from "@/lib/shipping/calculate";
export { extractShippingCountryFromSession } from "@/lib/shipping/session-country";
export type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";
export type { ShippingRateProvider } from "@/lib/shipping/providers/types";
