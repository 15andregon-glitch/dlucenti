import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function insertCampaign(
  client: Client,
  row: TablesInsert<"campaigns">,
) {
  return client.from("campaigns").insert(row).select().single();
}

export async function updateCampaign(
  client: Client,
  id: string,
  row: TablesUpdate<"campaigns">,
) {
  return client.from("campaigns").update(row).eq("id", id).select().single();
}

export async function deleteCampaign(client: Client, id: string) {
  return client.from("campaigns").delete().eq("id", id);
}

export async function reorderCampaigns(
  client: Client,
  ordered: { id: string; position: number }[],
) {
  const results = await Promise.all(
    ordered.map(({ id, position }) =>
      client.from("campaigns").update({ position }).eq("id", id),
    ),
  );
  const error = results.find((r) => r.error)?.error ?? null;
  return { error };
}
