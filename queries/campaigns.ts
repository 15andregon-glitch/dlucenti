import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function fetchCampaigns(client: Client, activeOnly = true) {
  let query = client.from("campaigns").select("*").order("position", {
    ascending: true,
  });

  if (activeOnly) {
    query = query.eq("active", true);
  }

  return query;
}
