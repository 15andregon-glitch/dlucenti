import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProductWithCollection } from "@/lib/supabase/mappers";
import { filterStorefrontProducts } from "@/lib/storefront-product-visibility";
import type { Product } from "@/lib/types";
import type { ShopNavCategory } from "@/lib/shop-catalog";
import {
  fetchStorefrontProducts,
  fetchStorefrontProductsByTargetGenders,
  fetchStorefrontProductsByTargetGendersAndCategory,
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

function toProducts(rows: ProductWithCollection[] | null): Product[] {
  return filterStorefrontProducts(rows ?? []).map((row) =>
    mapProductWithCollection(row),
  );
}

function toProduct(row: ProductWithCollection | null): Product | null {
  if (!row || !filterStorefrontProducts([row]).length) return null;
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
  const { data, error } = await fetchStorefrontProductsByTargetGenders(client, genders);
  if (error) throw error;
  return toProducts(data);
}

export async function getProductsByShopAudienceAndCategory(
  audience: ShopAudienceSegment,
  category: ShopNavCategory,
): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const genders = targetGendersForAudience(audience);
  const { data, error } = await fetchStorefrontProductsByTargetGendersAndCategory(
    client,
    genders,
    category,
  );
  if (error) throw error;
  return toProducts(data);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchFeaturedProducts(client);
  if (error) throw error;
  return toProducts(data);
}

export async function getNewInProducts(): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchNewInProducts(client);
  if (error) throw error;
  return toProducts(data);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchProductBySlug(client, slug);
  if (error) throw error;
  return toProduct(data as ProductWithCollection | null);
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
  return toProducts(data);
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchStorefrontProducts(client);
  if (error) throw error;

  const related = toProducts(data)
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
