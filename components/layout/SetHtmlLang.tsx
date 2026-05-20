"use client";

import { useEffect } from "react";
import { toIntlLocale, type Locale } from "@/lib/i18n/locale";

export function SetHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = toIntlLocale(locale);
  }, [locale]);

  return null;
}
