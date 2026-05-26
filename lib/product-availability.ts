import {
  findRingVariant,
  getActiveRingVariants,
  isRingProduct,
  sumRingVariantStock,
} from "@/lib/product-variants";
import type { Product, ProductVariant } from "@/lib/types";

export interface CartLineVariant {
  id: string;
  label: string;
  sku: string | null;
  stock: number;
}

/** Sellable units on hand for a cart line or product card. */
export function getProductStock(
  product: Pick<Product, "stock"> & Partial<Pick<Product, "category" | "variants">>,
  variant?: CartLineVariant | null,
): number {
  if (product.category && isRingProduct(product as Pick<Product, "category">)) {
    if (variant) return Math.max(0, variant.stock);
    return sumRingVariantStock(product.variants);
  }
  return Math.max(0, product.stock ?? 0);
}

export function isProductSoldOut(
  product: Pick<Product, "stock"> & Partial<Pick<Product, "category" | "variants">>,
): boolean {
  if (product.category && isRingProduct(product as Pick<Product, "category">)) {
    const active = getActiveRingVariants(product.variants);
    if (active.length === 0) return true;
    return !active.some((v) => v.stock > 0);
  }
  return getProductStock(product) <= 0;
}

/** Listing / PDP availability (rings do not require a selected size). */
export function isProductPurchasable(
  product: Pick<Product, "stock"> & Partial<Pick<Product, "category" | "variants">>,
): boolean {
  return !isProductSoldOut(product);
}

/** Cart add / checkout — rings require a selected in-stock variant. */
export function isCartLinePurchasable(
  product: Pick<Product, "stock" | "category" | "variants">,
  variant?: CartLineVariant | null,
): boolean {
  if (isRingProduct(product)) {
    if (!variant) return false;
    const match = findRingVariant(product.variants, variant.id);
    return Boolean(match?.isActive && variant.stock > 0);
  }
  return isProductPurchasable(product);
}

export function cartVariantFromProductVariant(
  variant: ProductVariant,
): CartLineVariant {
  return {
    id: variant.id,
    label: variant.label,
    sku: variant.sku,
    stock: variant.stock,
  };
}
