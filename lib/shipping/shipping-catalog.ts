import "server-only";

import type { CheckoutShippingOffer } from "@/lib/shipping/checkout-shipping-offers";

const MAX_METADATA_KEYS = 5;

export interface ShippingCatalogEntry {
  displayName: string;
  shippingCost: number;
  realShippingCost: number;
  freeShippingApplied: boolean;
  deliveryType: "home" | "pickup";
  packlinkServiceId?: string;
  carrierName?: string;
  serviceName?: string;
  pickupPointId?: string;
  pickupPointName?: string;
  pickupPointAddress?: string;
}

export function offersToCatalogEntries(
  offers: CheckoutShippingOffer[],
): ShippingCatalogEntry[] {
  return offers.map((o) => ({
    displayName: o.stripeDisplayName,
    shippingCost: o.shippingCost,
    realShippingCost: o.realShippingCost,
    freeShippingApplied: o.freeShippingApplied,
    deliveryType: o.deliveryType,
    packlinkServiceId: o.packlinkServiceId,
    carrierName: o.carrierName,
    serviceName: o.serviceName,
    pickupPointId: o.pickupPointId,
    pickupPointName: o.pickupPointName,
    pickupPointAddress: o.pickupPointAddress,
  }));
}

export function catalogToStripeMetadata(
  entries: ShippingCatalogEntry[],
): Record<string, string> {
  const serialized = JSON.stringify(entries);
  if (serialized.length <= 500) {
    return { ship_cat: serialized };
  }

  const out: Record<string, string> = {};
  let batch: ShippingCatalogEntry[] = [];
  let keyIndex = 0;

  for (const entry of entries) {
    const candidate = [...batch, entry];
    const next = JSON.stringify(candidate);
    if (next.length > 500 && batch.length > 0) {
      out[`ship_cat_${keyIndex}`] = JSON.stringify(batch);
      keyIndex += 1;
      batch = [entry];
      if (keyIndex >= MAX_METADATA_KEYS) break;
    } else {
      batch = candidate;
    }
  }

  if (batch.length > 0 && keyIndex < MAX_METADATA_KEYS) {
    out[`ship_cat_${keyIndex}`] = JSON.stringify(batch);
  }

  return out;
}

export function parseShippingCatalogFromMetadata(
  metadata: Record<string, string> | null | undefined,
): ShippingCatalogEntry[] {
  if (!metadata) return [];

  if (metadata.ship_cat) {
    try {
      const parsed = JSON.parse(metadata.ship_cat) as ShippingCatalogEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const combined: ShippingCatalogEntry[] = [];
  for (let i = 0; i < MAX_METADATA_KEYS; i += 1) {
    const raw = metadata[`ship_cat_${i}`];
    if (!raw) break;
    try {
      const parsed = JSON.parse(raw) as ShippingCatalogEntry[];
      if (Array.isArray(parsed)) combined.push(...parsed);
    } catch {
      /* skip bad chunk */
    }
  }
  return combined;
}

export function resolveCatalogEntry(
  catalog: ShippingCatalogEntry[],
  paidShipping: number,
  selectedDisplayName?: string | null,
): ShippingCatalogEntry | null {
  if (catalog.length === 0) return null;

  if (selectedDisplayName) {
    const byName = catalog.find((e) => e.displayName === selectedDisplayName);
    if (byName) return byName;
  }

  const byPrice = catalog.filter(
    (e) => Math.abs(e.shippingCost - paidShipping) < 0.02,
  );
  if (byPrice.length === 1) return byPrice[0]!;

  return byPrice[0] ?? null;
}
