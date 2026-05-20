"use client";

import { createContext, useContext, useMemo } from "react";
import { getClientTranslations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";
import type { Messages } from "@/messages/en";
import type { StorefrontRoutes } from "@/lib/routes";
import type { Translator } from "@/lib/i18n/translations";

interface LocaleContextValue {
  locale: Locale;
  messages: Messages;
  t: Translator;
  routes: StorefrontRoutes;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  const value = useMemo(
    () => getClientTranslations(locale, messages),
    [locale, messages],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
