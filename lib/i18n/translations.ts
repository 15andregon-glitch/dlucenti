import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import type { Messages } from "@/messages/en";
import { getRoutes } from "@/lib/routes";

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : Prefix extends ""
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type MessageKey = NestedKeyOf<Messages>;

function getByPath(obj: Messages, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object" || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(messages: Messages) {
  return function t(key: MessageKey): string {
    const value = getByPath(messages, key);
    if (value === undefined) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Missing key: ${key}`);
      }
      return key;
    }
    return value;
  };
}

export type Translator = ReturnType<typeof createTranslator>;

/** Server Components — load dictionary and helpers for a locale */
export async function getTranslations(locale: Locale) {
  const messages = getDictionary(locale);
  const t = createTranslator(messages);
  const routes = getRoutes(locale);
  return { t, messages, locale, routes };
}

/** Client-safe translator from preloaded messages */
export function getClientTranslations(locale: Locale, messages: Messages) {
  const t = createTranslator(messages);
  const routes = getRoutes(locale);
  return { t, messages, locale, routes };
}
