import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { storefrontProductsQuery } from "./products";

type Client = SupabaseClient<Database>;

export async function fetchHomepageSettings(client: Client) {
  return client
    .from("homepage_settings")
    .select("*, collections:featured_collection_id (*)")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function fetchHomepageNewIn(client: Client) {
  const { data: slots } = await client
    .from("homepage_new_in")
    .select("product_id, position")
    .order("position", { ascending: true });

  if (!slots?.length) return { data: [], error: null };

  const ids = slots.map((s) => s.product_id);
  const { data, error } = await storefrontProductsQuery(client).in("id", ids);

  if (error || !data) return { data: null, error };

  const order = new Map(ids.map((id, i) => [id, i]));
  const sorted = [...data].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  return { data: sorted, error: null };
}

export async function fetchActiveCampaigns(client: Client) {
  return client
    .from("campaigns")
    .select("*")
    .eq("active", true)
    .order("position", { ascending: true });
}
