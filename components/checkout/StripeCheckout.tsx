"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useTranslations } from "@/hooks/useTranslations";
import { isProductPurchasable } from "@/lib/product-availability";
import { cn } from "@/lib/cn";
import { useRefreshCartPrices } from "@/hooks/useRefreshCartPrices";

export function StripeCheckout() {
  const { t, routes, locale } = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useCartStore((s) => s.items);

  useRefreshCartPrices(mounted && items.length > 0);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const purchasableItems = items.filter((item) =>
    isProductPurchasable(item.product),
  );
  const isEmpty = purchasableItems.length === 0;

  if (isEmpty) {
    return (
      <div className="py-16">
        <p className="font-sans text-[1.25rem] text-[var(--maison-charcoal)]">
          {t("checkout.emptyTitle")}
        </p>
        <Link
          href={routes.shop}
          className="mt-6 inline-block font-sans text-[var(--maison-chrome-size)] text-[var(--maison-charcoal)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-60"
        >
          {t("checkout.returnToShop")}
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          items: purchasableItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? t("checkout.errorGeneric"));
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(t("checkout.errorGeneric"));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <p className="max-w-md font-sans text-[0.875rem] leading-[1.7] text-[var(--maison-gray)]">
        {t("checkout.secureNote")}
      </p>

      {error ? (
        <p className="font-sans text-[0.8125rem] text-[var(--maison-charcoal)]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={cn(
          "inline-flex min-h-[2.75rem] min-w-[14rem] items-center justify-center",
          "border border-[var(--maison-charcoal)] bg-[var(--maison-charcoal)] px-8 py-2.5",
          "font-sans text-[13px] font-normal tracking-normal text-[var(--maison-warm-white)]",
          "transition-opacity duration-500 ease-[var(--ease-maison)]",
          "hover:opacity-85 disabled:cursor-wait disabled:opacity-50",
        )}
      >
        {loading ? t("checkout.redirecting") : t("checkout.placeOrder")}
      </button>
    </div>
  );
}
