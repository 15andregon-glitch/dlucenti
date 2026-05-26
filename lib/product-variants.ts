import type { Product, ProductVariant } from "@/lib/types";

export const RING_PRODUCT_CATEGORY = "rings" as const;
export const RING_VARIANT_TYPE = "ring_size" as const;

export function isRingProduct(
  product: Pick<Product, "category">,
): boolean {
  return product.category === RING_PRODUCT_CATEGORY;
}

export function getCartLineKey(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function parseCartLineKey(lineKey: string): {
  productId: string;
  variantId?: string;
} {
  const [productId, variantId] = lineKey.split(":");
  return { productId, variantId: variantId || undefined };
}

export function getActiveRingVariants(
  variants: ProductVariant[] | undefined,
): ProductVariant[] {
  return (variants ?? [])
    .filter((v) => v.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function sumRingVariantStock(variants: ProductVariant[] | undefined): number {
  return getActiveRingVariants(variants).reduce((sum, v) => sum + v.stock, 0);
}

export function findRingVariant(
  variants: ProductVariant[] | undefined,
  variantId: string,
): ProductVariant | undefined {
  return variants?.find((v) => v.id === variantId);
}
