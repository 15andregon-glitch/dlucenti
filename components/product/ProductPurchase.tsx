"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cart";
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

  const handleAdd = () => {
    addItem(product, quantity);
    setOpen(true);
  };

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
            onClick={() => setQuantity((q) => q + 1)}
            className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button variant="solid" className="w-full sm:w-auto sm:min-w-[12rem]" onClick={handleAdd}>
          {t("product.addToCart")}
        </Button>
      </div>
    </div>
  );
}
