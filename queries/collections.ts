import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function fetchCollections(client: Client) {
  return client
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function fetchFeaturedCollections(client: Client) {
  return client
    .from("collections")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
}

export async function fetchCollectionBySlug(client: Client, slug: string) {
  return client.from("collections").select("*").eq("slug", slug).maybeSingle();
}
