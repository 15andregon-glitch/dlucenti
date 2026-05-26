import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { roundMoney } from "@/lib/prices";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";
import { buildCheckoutShippingOffers } from "@/lib/shipping/checkout-shipping-offers";
import {
  catalogToStripeMetadata,
  offersToCatalogEntries,
} from "@/lib/shipping/shipping-catalog";
import { buildStripeShippingOptionsFromOffers } from "@/lib/shipping/stripe-embedded-shipping";
import { getStripe } from "@/lib/stripe/config";

export const runtime = "nodejs";

interface ShippingDetailsBody {
  checkoutSessionId?: string;
  shippingDetails?: {
    name?: string;
    address?: {
      country?: string;
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      postal_code?: string | null;
      state?: string | null;
    };
  };
}

function parseSubtotal(session: Stripe.Checkout.Session): number {
  const raw = session.metadata?.subtotal;
  const n = raw != null ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < 0) {
    throw new Error("Checkout session missing subtotal metadata");
  }
  return roundMoney(n);
}

function localeFromSession(session: Stripe.Checkout.Session): Locale {
  const raw = session.metadata?.locale;
  return isValidLocale(raw) ? raw : "en";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ShippingDetailsBody;
    const sessionId = body.checkoutSessionId?.trim();
    const shippingDetails = body.shippingDetails;

    if (!sessionId || !shippingDetails?.address?.country) {
      return NextResponse.json(
        { error: "Invalid shipping details" },
        { status: 400 },
      );
    }

    const postalCode = shippingDetails.address.postal_code?.trim();
    if (!postalCode) {
      return NextResponse.json(
        { error: "Postal code is required", message: "Postal code is required" },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subtotal = parseSubtotal(session);
    const currency = (session.currency ?? "eur").toUpperCase();
    const locale = localeFromSession(session);

    const offers = await buildCheckoutShippingOffers({
      country: shippingDetails.address.country,
      postalCode,
      subtotal,
      currency,
      locale,
    });

    if (offers.length === 0) {
      throw new Error("No shipping options available");
    }

    const limitedOffers = offers.slice(0, 5);
    const shippingOptions = buildStripeShippingOptionsFromOffers(limitedOffers);
    const catalog = offersToCatalogEntries(limitedOffers);
    const catalogMeta = catalogToStripeMetadata(catalog);

    const address = shippingDetails.address;
    const countryCode = address.country!.toUpperCase();
    const hasPickup = limitedOffers.some((o) => o.deliveryType === "pickup");

    await stripe.checkout.sessions.update(sessionId, {
      collected_information: {
        shipping_details: {
          name: shippingDetails.name ?? "",
          address: {
            line1: address.line1 ?? undefined,
            line2: address.line2 ?? undefined,
            city: address.city ?? undefined,
            state: address.state ?? undefined,
            postal_code: postalCode,
            country: countryCode,
          },
        },
      },
      shipping_options: shippingOptions,
      metadata: {
        ...session.metadata,
        subtotal: String(subtotal),
        shipping_country: countryCode,
        shipping_provider: "packlink",
        has_pickup_options: hasPickup ? "true" : "false",
        ...catalogMeta,
      },
    } as Stripe.Checkout.SessionUpdateParams);

    console.info("[stripe/checkout/shipping] session updated", {
      sessionId,
      country: countryCode,
      offerCount: limitedOffers.length,
      hasPickup,
    });

    return NextResponse.json({
      ok: true,
      offerCount: limitedOffers.length,
      hasPickupOptions: hasPickup,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update shipping";

    console.error("[stripe/checkout/shipping] error", error);

    return NextResponse.json(
      { error: message, message },
      { status: 500 },
    );
  }
}
