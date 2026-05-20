import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  TablesInsert,
  TablesUpdate,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export async function reorderCollections(
  client: Client,
  ordered: { id: string; display_order: number }[],
) {
  const results = await Promise.all(
    ordered.map(({ id, display_order }) =>
      client.from("collections").update({ display_order }).eq("id", id),
    ),
  );
  const error = results.find((r) => r.error)?.error ?? null;
  return { error };
}

export async function insertCollectionMedia(
  client: Client,
  row: TablesInsert<"collection_media">,
) {
  return client.from("collection_media").insert(row).select().single();
}

export async function deleteCollectionMedia(client: Client, id: string) {
  return client.from("collection_media").delete().eq("id", id);
}

export async function reorderCollectionMedia(
  client: Client,
  ordered: { id: string; position: number }[],
) {
  const results = await Promise.all(
    ordered.map(({ id, position }) =>
      client.from("collection_media").update({ position }).eq("id", id),
    ),
  );
  const error = results.find((r) => r.error)?.error ?? null;
  return { error };
}

export async function insertCollectionBlock(
  client: Client,
  row: TablesInsert<"collection_blocks">,
) {
  return client.from("collection_blocks").insert(row).select().single();
}

export async function updateCollectionBlock(
  client: Client,
  id: string,
  row: TablesUpdate<"collection_blocks">,
) {
  return client.from("collection_blocks").update(row).eq("id", id).select().single();
}

export async function deleteCollectionBlock(client: Client, id: string) {
  return client.from("collection_blocks").delete().eq("id", id);
}

export async function reorderCollectionBlocks(
  client: Client,
  ordered: { id: string; position: number }[],
) {
  const results = await Promise.all(
    ordered.map(({ id, position }) =>
      client.from("collection_blocks").update({ position }).eq("id", id),
    ),
  );
  const error = results.find((r) => r.error)?.error ?? null;
  return { error };
}
