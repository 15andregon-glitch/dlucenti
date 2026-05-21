"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cart";
import {
  getProductStock,
  isProductPurchasable,
} from "@/lib/product-availability";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ProductPurchaseProps {
  product: Product;
  className?: string;
}

export function ProductPurchase({ product, className }: ProductPurchaseProps) {
  const { t } = useTranslations();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const purchasable = isProductPurchasable(product);
  const maxStock = getProductStock(product);

  const handleAdd = () => {
    if (!purchasable) return;
    addItem(product, quantity);
    setOpen(true);
  };

  if (!purchasable) {
    return (
      <div className={cn("mt-10", className)}>
        <span
          className="inline-flex w-full cursor-default items-center justify-center border border-[var(--maison-charcoal)] bg-[var(--maison-charcoal)] px-7 py-2.5 font-sans text-[13px] font-normal tracking-normal text-[var(--maison-warm-white)] opacity-60 sm:w-auto sm:min-w-[12rem]"
          aria-disabled
        >
          {t("product.unavailable")}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("mt-10", className)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div
          className="inline-flex items-center gap-6 border border-[var(--maison-hairline)] px-5 py-2.5"
          aria-label={t("product.quantity")}
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[1.25rem] text-center font-sans text-[var(--maison-chrome-size)] tabular-nums text-[var(--maison-charcoal)]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((q) => (maxStock > 0 ? Math.min(maxStock, q + 1) : q))
            }
            disabled={quantity >= maxStock}
            className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55 disabled:opacity-35"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button
          variant="solid"
          className="w-full sm:w-auto sm:min-w-[12rem]"
          onClick={handleAdd}
        >
          {t("product.addToCart")}
        </Button>
      </div>
    </div>
  );
}
