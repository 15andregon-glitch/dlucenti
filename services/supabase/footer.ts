import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapFooterContent } from "@/lib/supabase/footer-mapper";
import { fetchFooterSettings, fetchFooterSocialLinks } from "@/queries/footer";
import type { FooterContent } from "@/types/footer";

export async function getFooterContentFromSupabase(): Promise<FooterContent | null> {
  const client = await createSupabaseServerClient();
  const [settingsRes, linksRes] = await Promise.all([
    fetchFooterSettings(client),
    fetchFooterSocialLinks(client),
  ]);

  if (settingsRes.error) throw settingsRes.error;
  if (linksRes.error) throw linksRes.error;

  return mapFooterContent(settingsRes.data, linksRes.data ?? []);
}
