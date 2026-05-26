import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/database";
import { RING_VARIANT_TYPE } from "@/lib/product-variants";

export type ProductVariantRow = Tables<"product_variants">;

type Client = SupabaseClient<Database>;

export async function fetchVariantsByProductId(
  client: Client,
  productId: string,
  options?: { activeOnly?: boolean },
): Promise<ProductVariantRow[]> {
  let query = client
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("variant_type", RING_VARIANT_TYPE)
    .order("sort_order", { ascending: true });

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchVariantsByProductIds(
  client: Client,
  productIds: string[],
  options?: { activeOnly?: boolean },
): Promise<ProductVariantRow[]> {
  if (productIds.length === 0) return [];

  let query = client
    .from("product_variants")
    .select("*")
    .in("product_id", productIds)
    .eq("variant_type", RING_VARIANT_TYPE)
    .order("sort_order", { ascending: true });

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchVariantById(
  client: Client,
  variantId: string,
): Promise<ProductVariantRow | null> {
  const { data, error } = await client
    .from("product_variants")
    .select("*")
    .eq("id", variantId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function mapVariantRow(row: ProductVariantRow) {
  return {
    id: row.id,
    label: row.label,
    sku: row.sku,
    stock: Number(row.stock_quantity ?? 0),
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export async function syncProductStockFromVariants(
  client: Client,
  productId: string,
): Promise<void> {
  const { data: variants, error } = await client
    .from("product_variants")
    .select("stock_quantity")
    .eq("product_id", productId)
    .eq("is_active", true);

  if (error) throw error;

  const total = (variants ?? []).reduce(
    (sum, v) => sum + Number(v.stock_quantity ?? 0),
    0,
  );

  const { error: updateError } = await client
    .from("products")
    .update({ stock: total, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (updateError) throw updateError;
}

export type RingSizeInput = {
  id?: string;
  label: string;
  sku: string | null;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
};

export async function replaceRingSizesForProduct(
  client: Client,
  productId: string,
  sizes: RingSizeInput[],
): Promise<void> {
  const { data: existing, error: listError } = await client
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)
    .eq("variant_type", RING_VARIANT_TYPE);

  if (listError) throw listError;

  const keepIds = new Set(
    sizes.map((s) => s.id).filter((id): id is string => Boolean(id)),
  );
  const toDelete = (existing ?? [])
    .map((r) => r.id)
    .filter((id) => !keepIds.has(id));

  if (toDelete.length > 0) {
    const { error: deleteError } = await client
      .from("product_variants")
      .delete()
      .in("id", toDelete);
    if (deleteError) throw deleteError;
  }

  for (const size of sizes) {
    const row: TablesInsert<"product_variants"> = {
      product_id: productId,
      variant_type: RING_VARIANT_TYPE,
      label: size.label.trim(),
      sku: size.sku?.trim() || null,
      stock_quantity: Math.max(0, Math.floor(size.stockQuantity)),
      is_active: size.isActive,
      sort_order: size.sortOrder,
      updated_at: new Date().toISOString(),
    };

    if (size.id) {
      const { error } = await client
        .from("product_variants")
        .update(row)
        .eq("id", size.id)
        .eq("product_id", productId);
      if (error) throw error;
    } else {
      const { error } = await client.from("product_variants").insert(row);
      if (error) throw error;
    }
  }

  await syncProductStockFromVariants(client, productId);
}
