"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

/** Client components — access dictionary, routes, and t() */
export function useTranslations() {
  const { t, locale, routes, messages } = useLocale();
  return { t, locale, routes, messages };
}
