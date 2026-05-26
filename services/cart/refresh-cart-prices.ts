import "server-only";

import { getCartLineKey, isRingProduct } from "@/lib/product-variants";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapProductWithCollection } from "@/lib/supabase/mappers";
import { roundMoney } from "@/lib/prices";
import {
  fetchVariantsByProductIds,
  mapVariantRow,
} from "@/queries/product-variants";
import { PRODUCT_SELECT } from "@/queries/products";
import type { CartPriceRefreshPayload } from "@/store/cart";
import type { Product } from "@/lib/types";
import type { ProductWithCollection } from "@/types/database";

export interface CartRefreshLineInput {
  productId: string;
  variantId?: string;
}

export async function refreshCartProductPrices(
  lines: CartRefreshLineInput[],
): Promise<CartPriceRefreshPayload[]> {
  const normalized = lines.filter((l) => l.productId);
  if (normalized.length === 0) return [];

  const productIds = [...new Set(normalized.map((l) => l.productId))];
  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", productIds);

  if (error) {
    console.error("[cart] price refresh failed", error.message);
    throw new Error("Unable to refresh cart prices");
  }

  const products = (data ?? []).map((row) =>
    mapProductWithCollection(row as ProductWithCollection),
  );
  const byId = new Map(products.map((p) => [p.id, p]));

  const ringIds = products.filter((p) => isRingProduct(p)).map((p) => p.id);
  const variantRows =
    ringIds.length > 0 ? await fetchVariantsByProductIds(client, ringIds) : [];
  const variantsByProduct = new Map<string, ReturnType<typeof mapVariantRow>[]>();
  for (const row of variantRows) {
    const mapped = mapVariantRow(row);
    const list = variantsByProduct.get(row.product_id) ?? [];
    list.push(mapped);
    variantsByProduct.set(row.product_id, list);
  }

  return normalized.map((line) => {
    const product = byId.get(line.productId);
    if (!product) {
      throw new Error(`Product not found: ${line.productId}`);
    }

    const variants = variantsByProduct.get(product.id);
    const variant = line.variantId
      ? variants?.find((v) => v.id === line.variantId)
      : undefined;

    const stock = variant
      ? variant.stock
      : isRingProduct(product)
        ? (variants ?? []).reduce(
            (sum, v) => sum + (v.isActive ? v.stock : 0),
            0,
          )
        : product.stock;

    const lineKey = getCartLineKey(product.id, line.variantId);

    return {
      lineKey,
      id: product.id,
      variantId: line.variantId,
      price: roundMoney(product.price),
      stock,
      name: product.name,
      slug: product.slug,
      currency: product.currency,
      images: product.images,
      category: product.category as Product["category"],
      targetGender: product.targetGender,
      variants,
    };
  });
}
