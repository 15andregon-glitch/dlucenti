import type { Product } from "@/lib/types";

/** Sellable units on hand (inventory does not control storefront visibility). */
export function getProductStock(product: Pick<Product, "stock">): number {
  return Math.max(0, product.stock ?? 0);
}

export function isProductSoldOut(product: Pick<Product, "stock">): boolean {
  return getProductStock(product) <= 0;
}

export function isProductPurchasable(product: Pick<Product, "stock">): boolean {
  return !isProductSoldOut(product);
}
