import { DEFAULT_FOOTER_CONTENT } from "@/lib/data/footer-defaults";
import type { Locale } from "@/lib/i18n/locale";
import { useSupabaseDataSource } from "@/services/data-source";
import { getFooterContentFromSupabase } from "@/services/supabase/footer";
import {
  resolveFooterForLocale,
  type FooterContent,
  type FooterContentView,
} from "@/types/footer";

export async function getFooterContent(): Promise<FooterContent> {
  if (!useSupabaseDataSource()) {
    return DEFAULT_FOOTER_CONTENT;
  }

  try {
    const fromDb = await getFooterContentFromSupabase();
    return fromDb ?? DEFAULT_FOOTER_CONTENT;
  } catch {
    return DEFAULT_FOOTER_CONTENT;
  }
}

export async function getFooterContentForLocale(
  locale: Locale,
): Promise<FooterContentView> {
  const content = await getFooterContent();
  return resolveFooterForLocale(content, locale);
}
