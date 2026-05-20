export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  INTL_LOCALES,
  isValidLocale,
  detectLocale,
  localeFromAcceptLanguage,
  toIntlLocale,
  type Locale,
} from "@/lib/i18n/locale";

export { getDictionary } from "@/lib/i18n/dictionaries";
export {
  createTranslator,
  getTranslations,
  getClientTranslations,
  type Translator,
  type MessageKey,
} from "@/lib/i18n/translations";

export { localizedPath, stripLocalePrefix, replaceLocaleInPath } from "@/lib/i18n/paths";
