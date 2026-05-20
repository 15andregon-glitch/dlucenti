import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function fetchFooterSettings(client: Client) {
  return client
    .from("footer_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function fetchFooterSocialLinks(client: Client) {
  return client
    .from("footer_social_links")
    .select("*")
    .eq("active", true)
    .order("position", { ascending: true });
}

export async function fetchFooterSocialLinksAdmin(client: Client) {
  return client
    .from("footer_social_links")
    .select("*")
    .order("position", { ascending: true });
}
