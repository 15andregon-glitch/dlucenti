export {
  CHECKOUT_SHIPPING_COUNTRIES,
  DEFAULT_SHIPPING_COUNTRY,
  EUROPE_FREE_SHIPPING_THRESHOLD_EUR,
  isPortugalShippingCountry,
  PORTUGAL_COUNTRY_CODE,
  PORTUGAL_FALLBACK_SHIPPING_COST_EUR,
  PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR,
} from "@/lib/shipping/constants";
export { calculateShipping, normalizeShippingCountry } from "@/lib/shipping/calculate";
export { extractShippingCountryFromSession } from "@/lib/shipping/session-country";
export {
  buildPlaceholderStripeShippingOption,
  buildStripeShippingOptionsFromOffers,
} from "@/lib/shipping/stripe-embedded-shipping";
export { buildCheckoutShippingOffers } from "@/lib/shipping/checkout-shipping-offers";
export { quoteShippingForDestination } from "@/lib/shipping/quote-destination";
export type { DestinationShippingQuote } from "@/lib/shipping/quote-destination";
export type { ShippingQuote, ShippingQuoteInput } from "@/lib/shipping/types";
export type { ShippingRateProvider } from "@/lib/shipping/providers/types";
