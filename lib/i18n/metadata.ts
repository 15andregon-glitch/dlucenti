import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import { toIntlLocale } from "@/lib/i18n/locale";

export function localizedPageMetadata(
  locale: Locale,
  title: string,
  description?: string,
): Metadata {
  const messages = getDictionary(locale);
  return {
    title: `${title} · ${messages.meta.siteName}`,
    description: description ?? messages.meta.description,
    openGraph: {
      locale: toIntlLocale(locale),
      siteName: messages.meta.siteName,
    },
  };
}
