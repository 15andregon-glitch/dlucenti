import { toIntlLocale, type Locale } from "@/lib/i18n/locale";

/** Format price for cart and checkout surfaces */
export function formatPrice(
  amount: number,
  currency = "EUR",
  locale: Locale = "en",
): string {
  return `${amount.toLocaleString(toIntlLocale(locale), { maximumFractionDigits: 0 })} ${currency}`;
}
