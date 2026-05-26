import "server-only";

import { roundMoney } from "@/lib/prices";
import {
  freeShippingThresholdForCountry,
  isPortugalShippingCountry,
  PORTUGAL_FALLBACK_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
import { normalizeShippingCountry } from "@/lib/shipping/calculate";
import { PacklinkApiError, PacklinkClient } from "@/lib/shipping/packlink";
import { isPacklinkConfigured } from "@/lib/shipping/packlink-config";
import type { ShippingQuote } from "@/lib/shipping/types";

export interface DestinationQuoteInput {
  country: string;
  postalCode: string;
  subtotal: number;
  currency?: string;
}

export interface DestinationShippingQuote extends ShippingQuote {
  packlinkServiceId?: string;
  carrierName?: string;
  serviceName?: string;
}

function baseQuote(
  input: DestinationQuoteInput,
  shippingCost: number,
  providerId: string,
  extras?: Pick<DestinationShippingQuote, "packlinkServiceId" | "carrierName" | "serviceName">,
): DestinationShippingQuote {
  const country = normalizeShippingCountry(input.country);
  const subtotal = roundMoney(input.subtotal);
  const currency = (input.currency ?? "EUR").toUpperCase();
  const threshold = freeShippingThresholdForCountry(country);
  const isFreeShipping = shippingCost <= 0;
  const amountUntilFreeShipping = isFreeShipping
    ? 0
    : roundMoney(Math.max(0, threshold - subtotal));

  return {
    providerId,
    country,
    subtotal,
    shippingCost: roundMoney(shippingCost),
    total: roundMoney(subtotal + shippingCost),
    currency,
    freeShippingThreshold: threshold,
    amountUntilFreeShipping,
    isFreeShipping,
    ...extras,
  };
}

function quoteFree(input: DestinationQuoteInput): DestinationShippingQuote {
  return baseQuote(input, 0, "free-shipping-threshold");
}

function quotePortugalFallback(input: DestinationQuoteInput): DestinationShippingQuote {
  return baseQuote(
    input,
    PORTUGAL_FALLBACK_SHIPPING_COST_EUR,
    "fixed-regional-fallback",
  );
}

/**
 * Server-only shipping quote for a destination address.
 * Free thresholds: PT ≥50 EUR, Europe ≥80 EUR. Otherwise Packlink PRO.
 */
export async function quoteShippingForDestination(
  input: DestinationQuoteInput,
): Promise<DestinationShippingQuote> {
  const country = normalizeShippingCountry(input.country);
  const subtotal = roundMoney(input.subtotal);
  const threshold = freeShippingThresholdForCountry(country);

  if (subtotal >= threshold) {
    return quoteFree(input);
  }

  const postalCode = input.postalCode?.trim();
  if (!postalCode) {
    throw new Error("Postal code is required for shipping quote");
  }

  if (!isPacklinkConfigured()) {
    if (isPortugalShippingCountry(country)) {
      console.warn("[shipping] Packlink not configured — using Portugal fallback rate");
      return quotePortugalFallback(input);
    }
    throw new Error("Shipping quotes are temporarily unavailable");
  }

  try {
    const client = new PacklinkClient();
    const packlink = await client.getCheapestQuote({
      country,
      zip: postalCode,
    });

    return baseQuote(input, packlink.totalPrice, "packlink", {
      packlinkServiceId: packlink.serviceId,
      carrierName: packlink.carrierName,
      serviceName: packlink.serviceName,
    });
  } catch (error) {
    if (error instanceof PacklinkApiError) {
      console.error("[shipping] Packlink quote failed", {
        status: error.status,
        country,
        postalCode,
      });
    } else {
      console.error("[shipping] Packlink quote failed", error);
    }

    if (isPortugalShippingCountry(country)) {
      return quotePortugalFallback(input);
    }

    throw new Error("Unable to calculate shipping for this address");
  }
}
