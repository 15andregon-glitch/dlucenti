import { createSupabasePublicClient } from "@/lib/supabase/public";
import { mapProductWithCollection } from "@/lib/supabase/mappers";
import {
  filterHomepageProducts,
  filterStorefrontProducts,
} from "@/lib/product-editorial-visibility";
import { logStorefrontProductPipeline } from "@/lib/storefront-product-pipeline-debug";
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
import { isRingProduct } from "@/lib/product-variants";
import {
  fetchVariantsByProductId,
  mapVariantRow,
} from "@/queries/product-variants";
import type { ProductWithCollection } from "@/types/database";

function toProducts(
  rows: ProductWithCollection[] | null,
  label: string,
): Product[] {
  const fromSupabase = rows?.length ?? 0;
  const visible = filterStorefrontProducts(rows ?? []);
  const afterVisibility = visible.length;
  const mapped = visible.map((row) => mapProductWithCollection(row));
  logStorefrontProductPipeline(label, {
    fromSupabase,
    afterVisibility,
    afterMap: mapped.length,
  });
  return mapped;
}

function toProduct(
  row: ProductWithCollection | null,
  label: string,
): Product | null {
  if (!row) return null;
  const products = toProducts([row], label);
  return products[0] ?? null;
}

export async function getProducts(): Promise<Product[]> {
  return getProductsByShopAudience("all");
}

export async function getProductsByShopAudience(
  audience: ShopAudienceSegment,
): Promise<Product[]> {
  const client = createSupabasePublicClient();
  const genders = targetGendersForAudience(audience);
  const { data, error } = await fetchStorefrontProductsByTargetGenders(client, genders);
  if (error) {
    logStorefrontProductPipeline(`shop:${audience}`, { error: error.message });
    throw error;
  }
  return toProducts(data, `shop:${audience}`);
}

export async function getProductsByShopAudienceAndCategory(
  audience: ShopAudienceSegment,
  category: ShopNavCategory,
): Promise<Product[]> {
  const client = createSupabasePublicClient();
  const genders = targetGendersForAudience(audience);
  const { data, error } = await fetchStorefrontProductsByTargetGendersAndCategory(
    client,
    genders,
    category,
  );
  if (error) {
    logStorefrontProductPipeline(`shop:${audience}:${category}`, {
      error: error.message,
    });
    throw error;
  }
  return toProducts(data, `shop:${audience}:${category}`);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const client = createSupabasePublicClient();
  const { data, error } = await fetchFeaturedProducts(client);
  if (error) {
    logStorefrontProductPipeline("featured", { error: error.message });
    throw error;
  }
  return toProducts(data, "featured");
}

export async function getNewInProducts(): Promise<Product[]> {
  const client = createSupabasePublicClient();
  const { data, error } = await fetchNewInProducts(client);
  if (error) {
    logStorefrontProductPipeline("new-in", { error: error.message });
    throw error;
  }
  const rows = filterHomepageProducts(data ?? []);
  logStorefrontProductPipeline("new-in", {
    fromSupabase: data?.length ?? 0,
    afterVisibility: rows.length,
  });
  return rows.map((row) => mapProductWithCollection(row));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = createSupabasePublicClient();
  const { data, error } = await fetchProductBySlug(client, slug);
  if (error) {
    logStorefrontProductPipeline(`product:${slug}`, { error: error.message });
    throw error;
  }
  const product = toProduct(data as ProductWithCollection | null, `product:${slug}`);
  if (!product || !isRingProduct(product)) {
    return product;
  }

  try {
    const variantRows = await fetchVariantsByProductId(client, product.id, {
      activeOnly: true,
    });
    return {
      ...product,
      variants: variantRows.map(mapVariantRow),
    };
  } catch (variantError) {
    console.error(`[product:${slug}] variants fetch failed`, variantError);
    return product;
  }
}

export async function getProductsByCollection(
  collectionSlug: string,
): Promise<Product[]> {
  const client = createSupabasePublicClient();
  const { data, error } = await fetchProductsByCollectionSlug(
    client,
    collectionSlug,
  );
  if (error) {
    logStorefrontProductPipeline(`collection:${collectionSlug}`, {
      error: error.message,
    });
    throw error;
  }
  return toProducts(data, `collection:${collectionSlug}`);
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const client = createSupabasePublicClient();
  const { data, error } = await fetchStorefrontProducts(client);
  if (error) {
    logStorefrontProductPipeline("related", { error: error.message });
    throw error;
  }

  return toProducts(data, "related")
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.collectionSlug === product.collectionSlug),
    )
    .slice(0, limit);
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
