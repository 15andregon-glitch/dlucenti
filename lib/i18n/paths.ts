import { isValidLocale, type Locale } from "@/lib/i18n/locale";

/** Prefix a storefront path with locale, e.g. `/shop` → `/en/shop` */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/** Strip locale prefix from pathname; returns path like `/shop` or `/` */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  if (isValidLocale(segments[0])) {
    const rest = segments.slice(1);
    return rest.length === 0 ? "/" : `/${rest.join("/")}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/** Replace locale segment in a pathname while keeping the rest of the path */
export function replaceLocaleInPath(pathname: string, newLocale: Locale): string {
  const base = stripLocalePrefix(pathname);
  return localizedPath(newLocale, base);
}
