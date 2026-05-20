import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProductWithCollection } from "@/lib/supabase/mappers";
import type { Product } from "@/lib/types";
import type { ShopNavCategory } from "@/lib/shop-catalog";
import {
  fetchActiveProducts,
  fetchActiveProductsByTargetGenders,
  fetchActiveProductsByTargetGendersAndCategory,
  fetchFeaturedProducts,
  fetchNewInProducts,
  fetchProductBySlug,
  fetchProductsByCollectionSlug,
} from "@/queries/products";
import {
  targetGendersForAudience,
  type ShopAudienceSegment,
} from "@/lib/shop-audience";
import type { ProductWithCollection } from "@/types/database";

function toProduct(row: ProductWithCollection): Product {
  return mapProductWithCollection(row);
}

export async function getProducts(): Promise<Product[]> {
  return getProductsByShopAudience("all");
}

export async function getProductsByShopAudience(
  audience: ShopAudienceSegment,
): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const genders = targetGendersForAudience(audience);
  const { data, error } = await fetchActiveProductsByTargetGenders(client, genders);
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getProductsByShopAudienceAndCategory(
  audience: ShopAudienceSegment,
  category: ShopNavCategory,
): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const genders = targetGendersForAudience(audience);
  const { data, error } = await fetchActiveProductsByTargetGendersAndCategory(
    client,
    genders,
    category,
  );
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchFeaturedProducts(client);
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getNewInProducts(): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchNewInProducts(client);
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchProductBySlug(client, slug);
  if (error) throw error;
  if (!data) return null;
  return toProduct(data as ProductWithCollection);
}

export async function getProductsByCollection(
  collectionSlug: string,
): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchProductsByCollectionSlug(
    client,
    collectionSlug,
  );
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchActiveProducts(client);
  if (error) throw error;

  const related = (data ?? [])
    .map(toProduct)
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.collectionSlug === product.collectionSlug),
    )
    .slice(0, limit);

  return related;
}

/** Dashboard: all products including inactive */
export async function getAllProductsAdmin() {
  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("products")
    .select("*, product_images (*), collections (*)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) =>
    mapProductWithCollection(row as ProductWithCollection),
  );
}
