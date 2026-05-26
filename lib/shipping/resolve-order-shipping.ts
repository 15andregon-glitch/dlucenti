import "server-only";

import type Stripe from "stripe";
import { roundMoney } from "@/lib/prices";
import {
  parseShippingCatalogFromMetadata,
  resolveCatalogEntry,
  type ShippingCatalogEntry,
} from "@/lib/shipping/shipping-catalog";

export interface ResolvedOrderShipping extends ShippingCatalogEntry {
  paidShippingCost: number;
}

function paidShippingFromSession(
  session: Stripe.Checkout.Session,
  subtotal: number,
): number {
  const metaRaw = session.metadata?.shipping_cost;
  if (metaRaw != null && metaRaw !== "") {
    const n = Number(metaRaw);
    if (Number.isFinite(n)) return roundMoney(n);
  }
  const amountTotal = roundMoney((session.amount_total ?? 0) / 100);
  return roundMoney(amountTotal - subtotal);
}

function selectedShippingDisplayName(
  session: Stripe.Checkout.Session,
): string | null {
  const shippingCost = session.shipping_cost;
  if (!shippingCost || typeof shippingCost !== "object") return null;

  const rate = shippingCost.shipping_rate;
  if (rate && typeof rate === "object" && "display_name" in rate) {
    const name = rate.display_name;
    return typeof name === "string" ? name : null;
  }

  return null;
}

/**
 * Match paid shipping to the catalog stored on the Checkout Session at quote time.
 */
export function resolveOrderShippingFromSession(
  session: Stripe.Checkout.Session,
  subtotal: number,
): ResolvedOrderShipping | null {
  const catalog = parseShippingCatalogFromMetadata(
    session.metadata as Record<string, string> | undefined,
  );
  if (catalog.length === 0) return null;

  const paidShippingCost = paidShippingFromSession(session, subtotal);
  const displayName = selectedShippingDisplayName(session);
  const entry = resolveCatalogEntry(catalog, paidShippingCost, displayName);
  if (!entry) return null;

  return { ...entry, paidShippingCost };
}
