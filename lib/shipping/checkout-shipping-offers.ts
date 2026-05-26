import "server-only";

import { roundMoney } from "@/lib/prices";
import {
  freeShippingThresholdForCountry,
  isPortugalShippingCountry,
  PORTUGAL_FALLBACK_SHIPPING_COST_EUR,
} from "@/lib/shipping/constants";
import { normalizeShippingCountry } from "@/lib/shipping/calculate";
import {
  formatPacklinkDropoffAddress,
  listPacklinkDropoffs,
} from "@/lib/shipping/packlink-dropoff";
import {
  PacklinkApiError,
  PacklinkClient,
  type PacklinkServiceQuote,
} from "@/lib/shipping/packlink";
import {
  getDefaultPackage,
  getPacklinkOrigin,
  isPacklinkConfigured,
} from "@/lib/shipping/packlink-config";
import type { Locale } from "@/lib/i18n/locale";

/** Max pickup-point options shown in Stripe (plus one home delivery). */
const MAX_PICKUP_OPTIONS = 5;

export type ShippingDeliveryType = "home" | "pickup";

export interface CheckoutShippingOffer {
  deliveryType: ShippingDeliveryType;
  shippingCost: number;
  currency: string;
  stripeDisplayName: string;
  packlinkServiceId?: string;
  carrierName?: string;
  serviceName?: string;
  pickupPointId?: string;
  pickupPointName?: string;
  pickupPointAddress?: string;
}

export interface CheckoutShippingOffersInput {
  country: string;
  postalCode: string;
  subtotal: number;
  currency?: string;
  locale?: Locale;
}

function offerDisplayName(
  params: {
    deliveryType: ShippingDeliveryType;
    carrierName?: string;
    serviceName?: string;
    pickupPointName?: string;
    pickupPointAddress?: string;
    isFree: boolean;
  },
  locale: Locale,
): string {
  if (params.isFree) {
    if (params.deliveryType === "pickup") {
      return locale === "pt" ? "Recolha em ponto — incluído" : "Pickup point — included";
    }
    return locale === "pt" ? "Entrega em morada — incluído" : "Home delivery — included";
  }

  if (params.deliveryType === "pickup" && params.pickupPointName) {
    const where = params.pickupPointAddress
      ? ` — ${params.pickupPointName}, ${params.pickupPointAddress}`
      : ` — ${params.pickupPointName}`;
    const prefix =
      locale === "pt" ? "Recolha em ponto" : "Collect at pickup point";
    return `${prefix}${where}`.slice(0, 120);
  }

  const carrier = params.carrierName ?? (locale === "pt" ? "Transportadora" : "Carrier");
  const service = params.serviceName ?? (locale === "pt" ? "Standard" : "Standard");
  const prefix = locale === "pt" ? "Entrega em morada" : "Home delivery";
  return `${prefix} — ${carrier}, ${service}`.slice(0, 120);
}

function homeOfferFromService(
  service: PacklinkServiceQuote,
  shippingCost: number,
  currency: string,
  locale: Locale,
): CheckoutShippingOffer {
  const isFree = shippingCost <= 0;
  return {
    deliveryType: "home",
    shippingCost: roundMoney(shippingCost),
    currency,
    stripeDisplayName: offerDisplayName(
      {
        deliveryType: "home",
        carrierName: service.carrierName,
        serviceName: service.serviceName,
        isFree,
      },
      locale,
    ),
    packlinkServiceId: service.serviceId,
    carrierName: service.carrierName,
    serviceName: service.serviceName,
  };
}

function pickupOfferFromService(
  service: PacklinkServiceQuote,
  shippingCost: number,
  currency: string,
  locale: Locale,
  dropoff: Awaited<ReturnType<typeof listPacklinkDropoffs>>[number],
): CheckoutShippingOffer {
  const isFree = shippingCost <= 0;
  const address = formatPacklinkDropoffAddress(dropoff);
  return {
    deliveryType: "pickup",
    shippingCost: roundMoney(shippingCost),
    currency,
    stripeDisplayName: offerDisplayName(
      {
        deliveryType: "pickup",
        carrierName: service.carrierName,
        serviceName: service.serviceName,
        pickupPointName: dropoff.commerceName,
        pickupPointAddress: address,
        isFree,
      },
      locale,
    ),
    packlinkServiceId: service.serviceId,
    carrierName: service.carrierName,
    serviceName: service.serviceName,
    pickupPointId: dropoff.id,
    pickupPointName: dropoff.commerceName,
    pickupPointAddress: address,
  };
}

function fallbackHomeOffer(
  input: CheckoutShippingOffersInput,
  locale: Locale,
): CheckoutShippingOffer[] {
  const country = normalizeShippingCountry(input.country);
  const currency = (input.currency ?? "EUR").toUpperCase();
  const cost = roundMoney(PORTUGAL_FALLBACK_SHIPPING_COST_EUR);
  return [
    {
      deliveryType: "home",
      shippingCost: cost,
      currency,
      stripeDisplayName: offerDisplayName(
        {
          deliveryType: "home",
          carrierName: "Correos",
          serviceName: locale === "pt" ? "Standard" : "Standard",
          isFree: false,
        },
        locale,
      ),
      carrierName: "Correos",
      serviceName: "Standard",
    },
  ];
}

/**
 * Build Stripe shipping offers: home delivery + pickup points when Packlink supports them.
 *
 * Pickup limitation (documented): Stripe Embedded Checkout lists pickup locations as
 * shipping method labels — there is no Packlink point picker UI. Admins can choose
 * any drop-off when creating labels manually in Packlink PRO.
 */
export async function buildCheckoutShippingOffers(
  input: CheckoutShippingOffersInput,
): Promise<CheckoutShippingOffer[]> {
  const locale: Locale = input.locale === "pt" ? "pt" : "en";
  const country = normalizeShippingCountry(input.country);
  const subtotal = roundMoney(input.subtotal);
  const currency = (input.currency ?? "EUR").toUpperCase();
  const postalCode = input.postalCode.trim();
  const threshold = freeShippingThresholdForCountry(country);
  const isFreeShipping = subtotal >= threshold;
  const paidCost = (service: PacklinkServiceQuote) =>
    isFreeShipping ? 0 : service.totalPrice;

  if (!postalCode) {
    throw new Error("Postal code is required for shipping quote");
  }

  if (!isPacklinkConfigured()) {
    if (isPortugalShippingCountry(country)) {
      console.warn("[shipping] Packlink not configured — Portugal home fallback only");
      return fallbackHomeOffer(input, locale);
    }
    throw new Error("Shipping quotes are temporarily unavailable");
  }

  try {
    const client = new PacklinkClient();
    const services = await client.listServiceQuotes({
      from: getPacklinkOrigin(),
      to: { country, zip: postalCode },
      packages: [getDefaultPackage()],
    });

    if (services.length === 0) {
      throw new PacklinkApiError("No services", 404);
    }

    const homeServices = services.filter((s) => !s.deliveryToParcelshop);
    const pickupServices = services.filter((s) => s.deliveryToParcelshop);

    const offers: CheckoutShippingOffer[] = [];

    const bestHome = homeServices[0] ?? services[0];
    if (bestHome) {
      offers.push(homeOfferFromService(bestHome, paidCost(bestHome), currency, locale));
    }

    const pickupService = pickupServices[0];
    if (pickupService) {
      const dropoffs = await listPacklinkDropoffs(
        pickupService.serviceId,
        country,
        postalCode,
      );
      const points = dropoffs.slice(0, MAX_PICKUP_OPTIONS);
      for (const point of points) {
        offers.push(
          pickupOfferFromService(
            pickupService,
            paidCost(pickupService),
            currency,
            locale,
            point,
          ),
        );
      }

      if (points.length === 0) {
        console.info("[shipping] pickup service available but no dropoffs returned", {
          serviceId: pickupService.serviceId,
          country,
          postalCode,
        });
      }
    }

    return dedupeOffersByDisplayName(offers);
  } catch (error) {
    if (error instanceof PacklinkApiError) {
      console.error("[shipping] Packlink offers failed", {
        status: error.status,
        country,
        postalCode,
      });
    } else {
      console.error("[shipping] Packlink offers failed", error);
    }

    if (isPortugalShippingCountry(country)) {
      return fallbackHomeOffer(input, locale);
    }
    throw new Error("Unable to calculate shipping for this address");
  }
}

function dedupeOffersByDisplayName(
  offers: CheckoutShippingOffer[],
): CheckoutShippingOffer[] {
  const seen = new Set<string>();
  return offers.filter((o) => {
    if (seen.has(o.stripeDisplayName)) return false;
    seen.add(o.stripeDisplayName);
    return true;
  });
}
