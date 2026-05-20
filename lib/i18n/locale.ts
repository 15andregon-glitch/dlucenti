/** Supported storefront locales — extend here for new languages */
export const LOCALES = ["en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "maison-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  pt: "Português",
};

/** BCP 47 tags for Intl, html lang, and Open Graph */
export const INTL_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  pt: "pt-PT",
};

export function isValidLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Map browser language tags to a supported locale */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;

  const parts = header.split(",").map((part) => {
    const [tag, qPart] = part.trim().split(";q=");
    const q = qPart ? parseFloat(qPart) : 1;
    return { tag: tag.toLowerCase(), q };
  });

  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    if (tag.startsWith("pt")) return "pt";
    if (tag.startsWith("en")) return "en";
  }

  return null;
}

export interface LocaleDetectionInput {
  cookie?: string | null;
  acceptLanguage?: string | null;
}

/**
 * Priority: saved preference → browser language → English
 */
export function detectLocale(input: LocaleDetectionInput): Locale {
  if (isValidLocale(input.cookie)) return input.cookie;
  const fromBrowser = localeFromAcceptLanguage(input.acceptLanguage);
  if (fromBrowser) return fromBrowser;
  return DEFAULT_LOCALE;
}

export function toIntlLocale(locale: Locale): string {
  return INTL_LOCALES[locale];
}
