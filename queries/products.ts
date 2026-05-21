import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductCategory } from "@/lib/types/product";
import type { Database, ProductTargetGender } from "@/types/database";

export const PRODUCT_SELECT = `
  *,
  product_images (*),
  collections (*)
` as const;

type Client = SupabaseClient<Database>;

/**
 * Broad DB fetch: published rows + legacy rows (null publication_status, active).
 * Stock is never filtered. CMS hide/archive applied in services via filterStorefrontProducts.
 */
function storefrontProductsQuery(client: Client) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .or("publication_status.eq.published,and(publication_status.is.null,active.eq.true)");
}

export async function fetchStorefrontProducts(client: Client) {
  return storefrontProductsQuery(client).order("created_at", { ascending: false });
}

export async function fetchStorefrontProductsByTargetGenders(
  client: Client,
  genders: ProductTargetGender[],
) {
  return storefrontProductsQuery(client)
    .in("target_gender", genders)
    .order("created_at", { ascending: false });
}

export async function fetchStorefrontProductsByTargetGendersAndCategory(
  client: Client,
  genders: ProductTargetGender[],
  category: ProductCategory,
) {
  return storefrontProductsQuery(client)
    .in("target_gender", genders)
    .eq("category", category)
    .order("created_at", { ascending: false });
}

export async function fetchFeaturedProducts(client: Client) {
  return storefrontProductsQuery(client)
    .eq("featured", true)
    .order("created_at", { ascending: false });
}

export async function fetchProductBySlug(client: Client, slug: string) {
  return storefrontProductsQuery(client).eq("slug", slug).maybeSingle();
}

export async function fetchProductsByCollectionId(
  client: Client,
  collectionId: string,
) {
  return storefrontProductsQuery(client)
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false });
}

export async function fetchProductsByCollectionSlug(
  client: Client,
  collectionSlug: string,
) {
  const { data: collection } = await client
    .from("collections")
    .select("id")
    .eq("slug", collectionSlug)
    .maybeSingle();

  if (!collection) {
    return { data: [], error: null };
  }

  return fetchProductsByCollectionId(client, collection.id);
}

export async function fetchNewInProducts(client: Client) {
  const { data: slots, error: slotsError } = await client
    .from("homepage_new_in")
    .select("position, product_id")
    .order("position", { ascending: true });

  if (slotsError || !slots?.length) {
    return storefrontProductsQuery(client)
      .eq("new_in", true)
      .order("created_at", { ascending: false });
  }

  const productIds = slots.map((s) => s.product_id);
  const { data, error } = await storefrontProductsQuery(client).in("id", productIds);

  if (error || !data) return { data: null, error };

  const order = new Map(productIds.map((id, i) => [id, i]));
  const sorted = [...data].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  return { data: sorted, error: null };
}
