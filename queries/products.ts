import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductCategory } from "@/lib/types/product";
import type { Database, ProductTargetGender } from "@/types/database";

export const PRODUCT_SELECT = `
  *,
  product_images (*),
  collections (*)
` as const;

type Client = SupabaseClient<Database>;

export async function fetchActiveProducts(client: Client) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .order("created_at", { ascending: false });
}

export async function fetchActiveProductsByTargetGenders(
  client: Client,
  genders: ProductTargetGender[],
) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .in("target_gender", genders)
    .order("created_at", { ascending: false });
}

export async function fetchActiveProductsByTargetGendersAndCategory(
  client: Client,
  genders: ProductTargetGender[],
  category: ProductCategory,
) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .in("target_gender", genders)
    .eq("category", category)
    .order("created_at", { ascending: false });
}

export async function fetchFeaturedProducts(client: Client) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false });
}

export async function fetchProductBySlug(client: Client, slug: string) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
}

export async function fetchProductsByCollectionId(
  client: Client,
  collectionId: string,
) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
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
    return client
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("new_in", true)
      .order("created_at", { ascending: false });
  }

  const productIds = slots.map((s) => s.product_id);
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .in("id", productIds);

  if (error || !data) return { data: null, error };

  const order = new Map(productIds.map((id, i) => [id, i]));
  const sorted = [...data].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  return { data: sorted, error: null };
}
