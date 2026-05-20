import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function upsertFooterSettings(
  client: Client,
  row: TablesInsert<"footer_settings"> | TablesUpdate<"footer_settings">,
) {
  const { data: existing } = await client
    .from("footer_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return client
      .from("footer_settings")
      .update(row as TablesUpdate<"footer_settings">)
      .eq("id", existing.id)
      .select()
      .single();
  }

  return client
    .from("footer_settings")
    .insert(row as TablesInsert<"footer_settings">)
    .select()
    .single();
}

export async function insertFooterSocialLink(
  client: Client,
  row: TablesInsert<"footer_social_links">,
) {
  return client.from("footer_social_links").insert(row).select().single();
}

export async function updateFooterSocialLink(
  client: Client,
  id: string,
  row: TablesUpdate<"footer_social_links">,
) {
  return client.from("footer_social_links").update(row).eq("id", id).select().single();
}

export async function deleteFooterSocialLink(client: Client, id: string) {
  return client.from("footer_social_links").delete().eq("id", id);
}

export async function reorderFooterSocialLinks(
  client: Client,
  ordered: { id: string; position: number }[],
) {
  const results = await Promise.all(
    ordered.map(({ id, position }) =>
      client.from("footer_social_links").update({ position }).eq("id", id),
    ),
  );
  const error = results.find((r) => r.error)?.error ?? null;
  return { error };
}
