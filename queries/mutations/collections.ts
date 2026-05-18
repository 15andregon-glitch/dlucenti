import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function insertCollection(
  client: Client,
  row: TablesInsert<"collections">,
) {
  return client.from("collections").insert(row).select().single();
}

export async function updateCollection(
  client: Client,
  id: string,
  row: TablesUpdate<"collections">,
) {
  return client.from("collections").update(row).eq("id", id).select().single();
}

export async function deleteCollection(client: Client, id: string) {
  return client.from("collections").delete().eq("id", id);
}
