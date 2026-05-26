import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRole } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchCollectionById } from "@/queries/collections";
import { fetchVariantsByProductId } from "@/queries/product-variants";
import type {
  CampaignRow,
  CollectionBlockRow,
  CollectionMediaRow,
  CollectionRow,
  FooterSettingsRow,
  FooterSocialLinkRow,
  HomepageNewInRow,
  HomepageSettingsRow,
  ProductImageRow,
  ProductRow,
  ProductVariantRow,
  ProductWithCollection,
} from "@/types/database";

export type CollectionAdminDetail = CollectionRow & {
  collection_media: CollectionMediaRow[];
  collection_blocks: CollectionBlockRow[];
};

async function adminRead() {
  if (hasSupabaseServiceRole()) {
    return createSupabaseAdminClient();
  }
  return createSupabaseServerClient();
}

export async function listProductsAdmin(): Promise<ProductWithCollection[]> {
  const { data, error } = await (await adminRead())
    .from("products")
    .select("*, product_images (*), collections (*)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductWithCollection[];
}

export async function getProductAdmin(id: string): Promise<ProductWithCollection | null> {
  const { data, error } = await (await adminRead())
    .from("products")
    .select("*, product_images (*), collections (*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as ProductWithCollection | null;
}

export async function listRingSizesAdmin(
  productId: string,
): Promise<ProductVariantRow[]> {
  return fetchVariantsByProductId(await adminRead(), productId);
}

export async function listProductImagesAdmin(
  productId: string,
): Promise<ProductImageRow[]> {
  const { data, error } = await (await adminRead())
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listCollectionsAdmin(): Promise<CollectionRow[]> {
  const { data, error } = await (await adminRead())
    .from("collections")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getCollectionAdmin(
  id: string,
): Promise<CollectionAdminDetail | null> {
  const { data, error } = await fetchCollectionById(await adminRead(), id);
  if (error) throw error;
  if (!data) return null;
  const row = data as CollectionAdminDetail;
  return {
    ...row,
    collection_media: row.collection_media ?? [],
    collection_blocks: row.collection_blocks ?? [],
  };
}

export async function getHomepageSettingsAdmin(): Promise<HomepageSettingsRow | null> {
  const { data, error } = await (await adminRead())
    .from("homepage_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listHomepageNewInAdmin(): Promise<
  (HomepageNewInRow & { products: ProductRow })[]
> {
  const { data, error } = await (await adminRead())
    .from("homepage_new_in")
    .select("*, products (*)")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as (HomepageNewInRow & { products: ProductRow })[];
}

export async function listCampaignsAdmin(): Promise<CampaignRow[]> {
  const { data, error } = await (await adminRead())
    .from("campaigns")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type ProductSelectAdminRow = Pick<
  ProductRow,
  | "id"
  | "name"
  | "slug"
  | "publication_status"
  | "active"
  | "hidden_from_frontend"
  | "archived"
  | "featured"
>;

export async function listProductsForSelectAdmin(): Promise<ProductSelectAdminRow[]> {
  const { data, error } = await (await adminRead())
    .from("products")
    .select(
      "id, name, slug, publication_status, active, hidden_from_frontend, archived, featured",
    )
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getFooterSettingsAdmin(): Promise<FooterSettingsRow | null> {
  const { data, error } = await (await adminRead())
    .from("footer_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listFooterSocialLinksAdmin(): Promise<FooterSocialLinkRow[]> {
  const { data, error } = await (await adminRead())
    .from("footer_social_links")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
