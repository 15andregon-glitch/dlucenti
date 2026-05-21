import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductCategory } from "@/lib/types/product";
import type { Database, ProductTargetGender } from "@/types/database";
import { isMissingColumnError } from "@/lib/storefront-product-visibility";

export const PRODUCT_SELECT = `
  *,
  product_images (*),
  collections (*)
` as const;

type Client = SupabaseClient<Database>;

/**
 * CMS visibility: published + visible on storefront (active).
 * Stock is never filtered. When hidden_from_frontend exists, prefer that path below.
 */
function storefrontProductsQuery(client: Client) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("publication_status", "published")
    .eq("active", true);
}

function storefrontProductsQueryWithColumns(client: Client) {
  return client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("publication_status", "published")
    .eq("hidden_from_frontend", false)
    .eq("archived", false);
}

let storefrontQueryMode: "legacy" | "columns" | null = null;

async function pickStorefrontQuery(client: Client) {
  if (storefrontQueryMode === "legacy") return storefrontProductsQuery;
  if (storefrontQueryMode === "columns") return storefrontProductsQueryWithColumns;

  const probe = await storefrontProductsQueryWithColumns(client).limit(1);
  if (!probe.error) {
    storefrontQueryMode = "columns";
    return storefrontProductsQueryWithColumns;
  }
  if (isMissingColumnError(probe.error)) {
    storefrontQueryMode = "legacy";
    return storefrontProductsQuery;
  }
  storefrontQueryMode = "legacy";
  return storefrontProductsQuery;
}

export async function fetchStorefrontProducts(client: Client) {
  const build = await pickStorefrontQuery(client);
  return build(client).order("created_at", { ascending: false });
}

export async function fetchStorefrontProductsByTargetGenders(
  client: Client,
  genders: ProductTargetGender[],
) {
  const build = await pickStorefrontQuery(client);
  return build(client)
    .in("target_gender", genders)
    .order("created_at", { ascending: false });
}

export async function fetchStorefrontProductsByTargetGendersAndCategory(
  client: Client,
  genders: ProductTargetGender[],
  category: ProductCategory,
) {
  const build = await pickStorefrontQuery(client);
  return build(client)
    .in("target_gender", genders)
    .eq("category", category)
    .order("created_at", { ascending: false });
}

export async function fetchFeaturedProducts(client: Client) {
  const build = await pickStorefrontQuery(client);
  return build(client).eq("featured", true).order("created_at", { ascending: false });
}

export async function fetchProductBySlug(client: Client, slug: string) {
  const build = await pickStorefrontQuery(client);
  return build(client).eq("slug", slug).maybeSingle();
}

export async function fetchProductsByCollectionId(
  client: Client,
  collectionId: string,
) {
  const build = await pickStorefrontQuery(client);
  return build(client)
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
  const build = await pickStorefrontQuery(client);
  const { data: slots, error: slotsError } = await client
    .from("homepage_new_in")
    .select("position, product_id")
    .order("position", { ascending: true });

  if (slotsError || !slots?.length) {
    return build(client).eq("new_in", true).order("created_at", { ascending: false });
  }

  const productIds = slots.map((s) => s.product_id);
  const { data, error } = await build(client).in("id", productIds);

  if (error || !data) return { data: null, error };

  const order = new Map(productIds.map((id, i) => [id, i]));
  const sorted = [...data].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  return { data: sorted, error: null };
}
