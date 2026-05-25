import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapProductWithCollection } from "@/lib/supabase/mappers";
import { roundMoney } from "@/lib/prices";
import { PRODUCT_SELECT } from "@/queries/products";
import type { Product } from "@/lib/types";
import type { ProductWithCollection } from "@/types/database";

export interface RefreshedCartProduct {
  id: string;
  price: number;
  stock: number;
  name: string;
  slug: string;
  currency: string;
  images: string[];
  category: Product["category"];
  targetGender: Product["targetGender"];
}

export async function refreshCartProductPrices(
  productIds: string[],
): Promise<RefreshedCartProduct[]> {
  const ids = [...new Set(productIds.filter(Boolean))];
  if (ids.length === 0) return [];

  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", ids);

  if (error) {
    console.error("[cart] price refresh failed", error.message);
    throw new Error("Unable to refresh cart prices");
  }

  return (data ?? []).map((row) => {
    const product = mapProductWithCollection(row as ProductWithCollection);
    return {
      id: product.id,
      price: roundMoney(product.price),
      stock: product.stock,
      name: product.name,
      slug: product.slug,
      currency: product.currency,
      images: product.images,
      category: product.category,
      targetGender: product.targetGender,
    };
  });
}
