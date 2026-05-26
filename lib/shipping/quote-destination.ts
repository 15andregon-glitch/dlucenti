import "server-only";

import { roundMoney } from "@/lib/prices";
import { freeShippingThresholdForCountry } from "@/lib/shipping/constants";
import { normalizeShippingCountry } from "@/lib/shipping/calculate";
import { buildCheckoutShippingOffers } from "@/lib/shipping/checkout-shipping-offers";
import type { ShippingQuote } from "@/lib/shipping/types";
import type { Locale } from "@/lib/i18n/locale";

export interface DestinationQuoteInput {
  country: string;
  postalCode: string;
  subtotal: number;
  currency?: string;
  locale?: Locale;
}

export interface DestinationShippingQuote extends ShippingQuote {
  packlinkServiceId?: string;
  carrierName?: string;
  serviceName?: string;
  deliveryType?: "home" | "pickup";
  pickupPointId?: string;
  pickupPointName?: string;
  pickupPointAddress?: string;
}

/**
 * Cheapest single offer (home delivery preferred) — used where only one quote is needed.
 */
export async function quoteShippingForDestination(
  input: DestinationQuoteInput,
): Promise<DestinationShippingQuote> {
  const offers = await buildCheckoutShippingOffers(input);
  const country = normalizeShippingCountry(input.country);
  const subtotal = roundMoney(input.subtotal);
  const currency = (input.currency ?? "EUR").toUpperCase();
  const home = offers.find((o) => o.deliveryType === "home") ?? offers[0];

  if (!home) {
    throw new Error("No shipping offers available");
  }

  const threshold = freeShippingThresholdForCountry(country);
  const isFreeShipping = subtotal >= threshold;
  const amountUntilFreeShipping = isFreeShipping
    ? 0
    : roundMoney(Math.max(0, threshold - subtotal));

  return {
    providerId: "packlink",
    country,
    subtotal,
    shippingCost: home.shippingCost,
    total: roundMoney(subtotal + home.shippingCost),
    currency,
    freeShippingThreshold: threshold,
    amountUntilFreeShipping,
    isFreeShipping,
    packlinkServiceId: home.packlinkServiceId,
    carrierName: home.carrierName,
    serviceName: home.serviceName,
    deliveryType: home.deliveryType,
    pickupPointId: home.pickupPointId,
    pickupPointName: home.pickupPointName,
    pickupPointAddress: home.pickupPointAddress,
  };
}
