import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export const COLLECTION_EDITORIAL_SELECT = `
  *,
  collection_media (*),
  collection_blocks (*)
` as const;

export async function fetchCollections(client: Client) {
  return client
    .from("collections")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
}

export async function fetchPublishedCollections(client: Client) {
  return client
    .from("collections")
    .select(COLLECTION_EDITORIAL_SELECT)
    .eq("publication_status", "published")
    .eq("hidden_from_frontend", false)
    .order("launch_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
}

export async function fetchFeaturedCollections(client: Client) {
  return client
    .from("collections")
    .select(COLLECTION_EDITORIAL_SELECT)
    .eq("featured", true)
    .eq("publication_status", "published")
    .eq("hidden_from_frontend", false)
    .order("launch_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
}

export async function fetchCollectionBySlug(client: Client, slug: string) {
  return client.from("collections").select("*").eq("slug", slug).maybeSingle();
}

export async function fetchPublishedCollectionBySlug(client: Client, slug: string) {
  return client
    .from("collections")
    .select(COLLECTION_EDITORIAL_SELECT)
    .eq("slug", slug)
    .eq("publication_status", "published")
    .eq("hidden_from_frontend", false)
    .maybeSingle();
}

export async function fetchCollectionById(client: Client, id: string) {
  return client
    .from("collections")
    .select(COLLECTION_EDITORIAL_SELECT)
    .eq("id", id)
    .maybeSingle();
}
