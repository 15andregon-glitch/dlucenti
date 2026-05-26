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
import {
  CHECKOUT_SHIPPING_COUNTRIES,
  buildPlaceholderStripeShippingOption,
} from "@/lib/shipping";
import { getSiteUrl, getStripe } from "@/lib/stripe/config";
import Stripe from "stripe";

export const runtime = "nodejs";

interface CheckoutBody {
  locale?: string;
  items?: CheckoutCartLineInput[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const localeParam = body.locale ?? "en";
    const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";

    const cart = await validateCheckoutCart(body.items ?? []);
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

    const placeholderShipping = buildPlaceholderStripeShippingOption(cart.currency);

    // embedded_page + server-only shipping updates (Packlink quotes after address entry).
    // permissions.update_shipping_details must be top-level (not permissions.update.*).
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      locale: locale === "pt" ? "pt" : "en",
      currency: cart.currency.toLowerCase(),
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [...CHECKOUT_SHIPPING_COUNTRIES],
      },
      permissions: {
        update_shipping_details: "server_only",
      },
      shipping_options: [placeholderShipping],
      automatic_tax: { enabled: false },
      payment_method_types: ["card"],
      return_url: `${siteUrl}${localizedPath(locale, "/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        locale,
        cart: cartMetadata,
        subtotal: String(cart.subtotal),
      },
    });

    if (!session.client_secret) {
      console.error(
        "[stripe/checkout] session missing client_secret",
        session.id,
      );
      return NextResponse.json(
        { error: "Unable to start checkout: missing client_secret", code: "NO_CLIENT_SECRET" },
        { status: 500 },
      );
    }

    console.info("[stripe/checkout] embedded session created", {
      sessionId: session.id,
      subtotal: cart.subtotal,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to start checkout";
    const code =
      error instanceof Stripe.errors.StripeError ? error.code ?? "STRIPE" : "CHECKOUT";

    if (error instanceof Stripe.errors.StripeError) {
      console.error("[stripe/checkout] stripe error", { code, message });
    } else {
      console.error("[stripe/checkout] unexpected error", { code, message, error });
    }

    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}
