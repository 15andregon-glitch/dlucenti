import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRole } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CampaignRow,
  CollectionRow,
  HomepageNewInRow,
  HomepageSettingsRow,
  ProductImageRow,
  ProductRow,
  ProductWithCollection,
} from "@/types/database";

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
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCollectionAdmin(id: string): Promise<CollectionRow | null> {
  const { data, error } = await (await adminRead())
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
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

export async function listProductsForSelectAdmin(): Promise<
  Pick<ProductRow, "id" | "name" | "slug">[]
> {
  const { data, error } = await (await adminRead())
    .from("products")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
