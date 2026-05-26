"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useTranslations } from "@/hooks/useTranslations";
import { isProductPurchasable } from "@/lib/product-availability";
import { useRefreshCartPrices } from "@/hooks/useRefreshCartPrices";
import { StripeEmbeddedCheckout } from "@/components/checkout/StripeEmbeddedCheckout";

export function StripeCheckout() {
  const { t, routes, locale } = useTranslations();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);

  useRefreshCartPrices(mounted && items.length > 0);

  useEffect(() => setMounted(true), []);

  const purchasableItems = useMemo(
    () => items.filter((item) => isProductPurchasable(item.product)),
    [items],
  );

  const checkoutItems = useMemo(
    () =>
      purchasableItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    [purchasableItems],
  );

  if (!mounted) return null;

  if (purchasableItems.length === 0) {
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

  return (
    <div className="space-y-8">
      <p className="max-w-md font-sans text-[0.875rem] leading-[1.7] text-[var(--maison-gray)]">
        {t("checkout.secureNote")}
      </p>

      <StripeEmbeddedCheckout locale={locale} items={checkoutItems} />
    </div>
  );
}
