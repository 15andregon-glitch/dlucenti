"use client";

import { formatPrice } from "@/lib/cart";
import {
  calculateShipping,
  DEFAULT_SHIPPING_COUNTRY,
  PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR,
} from "@/lib/shipping";
import type { ShippingQuote } from "@/lib/shipping";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

interface ShippingSummaryProps {
  subtotal: number;
  currency?: string;
  shippingCountry?: string;
  className?: string;
  showPortugalHint?: boolean;
}

function replaceAmount(template: string, amount: string): string {
  return template.replace("{{amount}}", amount);
}

export function ShippingSummary({
  subtotal,
  currency = "EUR",
  shippingCountry = DEFAULT_SHIPPING_COUNTRY,
  className,
  showPortugalHint = false,
}: ShippingSummaryProps) {
  const { t, locale } = useTranslations();
  const quote: ShippingQuote = calculateShipping(shippingCountry, subtotal, currency);
  const isPortugal = quote.country === "PT";
  const threshold = quote.freeShippingThreshold ?? PORTUGAL_FREE_SHIPPING_THRESHOLD_EUR;
  const progress =
    isPortugal && threshold > 0
      ? Math.min(100, (quote.subtotal / threshold) * 100)
      : 0;

  const shippingLabel = quote.isFreeShipping
    ? t("checkout.shippingIncluded")
    : formatPrice(quote.shippingCost, currency, locale);

  const remainingText =
    isPortugal && !quote.isFreeShipping && quote.amountUntilFreeShipping != null
      ? replaceAmount(
          t("checkout.freeShippingRemaining"),
          formatPrice(quote.amountUntilFreeShipping, currency, locale),
        )
      : null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
          {t("cart.subtotal")}
        </span>
        <span className="font-sans text-[0.8125rem] tabular-nums text-[var(--maison-charcoal)]">
          {formatPrice(quote.subtotal, currency, locale)}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
          {t("checkout.shipping")}
        </span>
        <span
          className={cn(
            "font-sans text-[0.8125rem] tabular-nums",
            quote.isFreeShipping
              ? "text-[var(--maison-mist)]"
              : "text-[var(--maison-charcoal)]",
          )}
        >
          {shippingLabel}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-[var(--maison-hairline)] pt-3">
        <span className="font-sans text-[0.875rem] text-[var(--maison-charcoal)]">
          {t("checkout.total")}
        </span>
        <span className="font-sans text-[0.9375rem] tabular-nums text-[var(--maison-charcoal)]">
          {formatPrice(quote.total, currency, locale)}
        </span>
      </div>

      {isPortugal ? (
        <div className="space-y-2 pt-1">
          <div
            className="h-px w-full overflow-hidden bg-[var(--maison-hairline)]"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("checkout.freeShippingNote")}
          >
            <div
              className="h-px bg-[var(--maison-gold)] transition-[width] duration-500 ease-[var(--ease-maison)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
            {quote.isFreeShipping
              ? t("checkout.freeShippingUnlocked")
              : (remainingText ?? t("checkout.freeShippingNote"))}
          </p>
          {showPortugalHint ? (
            <p className="font-sans text-[0.6875rem] leading-relaxed text-[var(--maison-mist)]">
              {t("cart.shippingPortugalEstimate")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
