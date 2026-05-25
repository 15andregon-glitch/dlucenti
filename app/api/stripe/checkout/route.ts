import { NextResponse } from "next/server";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";
import { localizedPath } from "@/lib/i18n/paths";
import { absoluteAssetUrl } from "@/lib/checkout/absolute-url";
import {
  CheckoutValidationError,
  validateCheckoutCart,
} from "@/lib/checkout/validate-cart";
import type { CheckoutCartLineInput } from "@/lib/checkout/types";
import { eurosToStripeCents } from "@/lib/prices";
import { CHECKOUT_SHIPPING_COUNTRIES } from "@/lib/shipping";
import { getSiteUrl, getStripe } from "@/lib/stripe/config";

export const runtime = "nodejs";

interface CheckoutBody {
  locale?: string;
  items?: CheckoutCartLineInput[];
  shippingCountry?: string;
}

function shippingLineName(locale: Locale): string {
  return locale === "pt" ? "Envio" : "Shipping";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const localeParam = body.locale ?? "en";
    const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";

    const cart = await validateCheckoutCart(
      body.items ?? [],
      body.shippingCountry,
    );
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const cartMetadata = JSON.stringify(
      cart.lines.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        unitCost: line.unitCost,
        name: line.name,
      })),
    );

    if (cartMetadata.length > 500) {
      console.error("[stripe/checkout] cart metadata exceeds Stripe limit");
      return NextResponse.json(
        { error: "Cart too large for checkout" },
        { status: 400 },
      );
    }

    const lineItems = cart.lines.map((line) => {
      const image = absoluteAssetUrl(line.imageUrl);
      return {
        quantity: line.quantity,
        price_data: {
          currency: cart.currency.toLowerCase(),
          unit_amount: eurosToStripeCents(line.unitPrice),
          product_data: {
            name: line.name,
            ...(image ? { images: [image] } : {}),
          },
        },
      };
    });

    if (cart.shipping.shippingCost > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: cart.currency.toLowerCase(),
          unit_amount: eurosToStripeCents(cart.shipping.shippingCost),
          product_data: {
            name: shippingLineName(locale),
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: locale === "pt" ? "pt" : "en",
      currency: cart.currency.toLowerCase(),
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [...CHECKOUT_SHIPPING_COUNTRIES],
      },
      automatic_tax: { enabled: false },
      payment_method_types: ["card"],
      success_url: `${siteUrl}${localizedPath(locale, "/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localizedPath(locale, "/checkout/cancel")}`,
      metadata: {
        locale,
        cart: cartMetadata,
        subtotal: String(cart.subtotal),
        shipping_cost: String(cart.shipping.shippingCost),
        shipping_country: cart.shipping.country,
      },
    });

    if (!session.url) {
      console.error("[stripe/checkout] session missing url", session.id);
      return NextResponse.json(
        { error: "Unable to start checkout" },
        { status: 500 },
      );
    }

    console.info("[stripe/checkout] session created", {
      sessionId: session.id,
      subtotal: cart.subtotal,
      shipping: cart.shipping.shippingCost,
      country: cart.shipping.country,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
    }

    console.error("[stripe/checkout] unexpected error", error);
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 },
    );
  }
}
