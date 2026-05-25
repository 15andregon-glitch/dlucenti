import { toIntlLocale, type Locale } from "@/lib/i18n/locale";

const MONEY_EPSILON = 1e-9;

/** Round to 2 decimal places (EUR) without float drift */
export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round((amount + MONEY_EPSILON) * 100) / 100;
}

/**
 * Parse CMS / form price strings — accepts `0,01`, `0.01`, `1.234,56`, `1,234.56`.
 * Returns amount in EUR (not cents).
 */
export function parsePriceInput(
  value: FormDataEntryValue | string | number | null | undefined,
): number {
  if (value == null) return 0;
  if (typeof value === "number") return roundMoney(value);

  let raw = String(value).trim();
  if (!raw) return 0;

  raw = raw
    .replace(/[€$£\s]/g, "")
    .replace(/\bEUR\b/gi, "")
    .trim();

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  let normalized = raw;

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      normalized = raw.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = raw.replace(/,/g, "");
    }
  } else if (lastComma >= 0) {
    normalized = raw.replace(",", ".");
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return 0;
  return roundMoney(parsed);
}

/** Parse price input to integer cents for Stripe (0,01 EUR → 1). */
export function parsePriceInputToCents(
  value: FormDataEntryValue | string | number | null | undefined,
): number {
  return eurosToStripeCents(parsePriceInput(value));
}

export function eurosToStripeCents(euros: number): number {
  const rounded = roundMoney(euros);
  return Math.round(rounded * 100);
}

export function centsToEuros(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return roundMoney(cents / 100);
}

export function centsToDisplayPrice(
  cents: number,
  currency = "EUR",
  locale: Locale = "en",
): string {
  return formatPrice(centsToEuros(cents), currency, locale);
}

/** True when Stripe can charge at least 1 cent for this unit price */
export function isValidStripeUnitPrice(euros: number): boolean {
  return eurosToStripeCents(euros) >= 1;
}

/**
 * Storefront / cart display.
 * PT: `0,01 EUR`, `10 EUR` (whole) or `10,00 EUR` when decimals matter.
 * EN: `€0.01`, `€10.00`
 */
export function formatPrice(
  amount: number,
  currency = "EUR",
  locale: Locale = "en",
): string {
  const euros = roundMoney(amount);

  if (locale === "pt") {
    const hasFraction = Math.abs(euros % 1) > MONEY_EPSILON;
    const formatted = euros.toLocaleString(toIntlLocale(locale), {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(toIntlLocale(locale), {
      style: "currency",
      currency: currency.length === 3 ? currency : "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(euros);
  } catch {
    return `${euros.toFixed(2)} ${currency}`;
  }
}

/** Default value for admin price fields (dot decimal, up to 2 places) */
export function formatPriceInputValue(euros: number): string {
  const rounded = roundMoney(euros);
  if (Math.abs(rounded % 1) < MONEY_EPSILON) {
    return String(Math.trunc(rounded));
  }
  return rounded.toFixed(2);
}
