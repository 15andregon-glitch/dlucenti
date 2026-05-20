import type { ProductCategory } from "@/lib/types/product";

/** Piece types shown in shop navigation (excludes objects). */
export const SHOP_NAV_CATEGORIES = [
  "rings",
  "necklaces",
  "bracelets",
  "earrings",
] as const satisfies readonly ProductCategory[];

export type ShopNavCategory = (typeof SHOP_NAV_CATEGORIES)[number];

export function isShopNavCategory(value: string): value is ShopNavCategory {
  return (SHOP_NAV_CATEGORIES as readonly string[]).includes(value);
}
