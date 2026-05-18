import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function insertProduct(client: Client, row: TablesInsert<"products">) {
  return client.from("products").insert(row).select().single();
}

export async function updateProduct(
  client: Client,
  id: string,
  row: TablesUpdate<"products">,
) {
  return client.from("products").update(row).eq("id", id).select().single();
}

export async function deleteProduct(client: Client, id: string) {
  return client.from("products").delete().eq("id", id);
}

export async function upsertProductImages(
  client: Client,
  rows: TablesInsert<"product_images">[],
) {
  return client.from("product_images").upsert(rows, {
    onConflict: "product_id,position",
  });
}

export async function deleteProductImage(client: Client, id: string) {
  return client.from("product_images").delete().eq("id", id);
}
