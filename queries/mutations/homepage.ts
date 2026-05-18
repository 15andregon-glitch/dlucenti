import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function upsertHomepageSettings(
  client: Client,
  row: TablesInsert<"homepage_settings"> | TablesUpdate<"homepage_settings">,
) {
  const { data: existing } = await client
    .from("homepage_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return client
      .from("homepage_settings")
      .update(row as TablesUpdate<"homepage_settings">)
      .eq("id", existing.id)
      .select()
      .single();
  }

  return client
    .from("homepage_settings")
    .insert(row as TablesInsert<"homepage_settings">)
    .select()
    .single();
}

export async function setHomepageNewIn(
  client: Client,
  items: { product_id: string; position: number }[],
) {
  await client.from("homepage_new_in").delete().gte("position", 0);

  if (!items.length) return { data: [], error: null };

  return client.from("homepage_new_in").insert(items).select();
}
