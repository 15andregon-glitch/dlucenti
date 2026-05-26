"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cart";
import {
  cartVariantFromProductVariant,
  getProductStock,
  isCartLinePurchasable,
  isProductPurchasable,
  isProductSoldOut,
} from "@/lib/product-availability";
import { getActiveRingVariants, isRingProduct } from "@/lib/product-variants";
import type { Product, ProductVariant } from "@/lib/types";
import { RingSizeSelector } from "@/components/product/RingSizeSelector";
import { cn } from "@/lib/cn";

interface ProductPurchaseProps {
  product: Product;
  className?: string;
}

export function ProductPurchase({ product, className }: ProductPurchaseProps) {
  const { t } = useTranslations();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const isRing = isRingProduct(product);
  const soldOut = isProductSoldOut(product);
  const purchasable = isProductPurchasable(product);
  const activeSizes = useMemo(
    () => getActiveRingVariants(product.variants),
    [product.variants],
  );
  const hasAvailableSize = activeSizes.some((s) => s.stock > 0);

  const cartVariant = selectedVariant
    ? cartVariantFromProductVariant(selectedVariant)
    : undefined;
  const maxStock = getProductStock(product, cartVariant);
  const canAdd =
    purchasable &&
    (!isRing || (selectedVariant && isCartLinePurchasable(product, cartVariant)));

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product, quantity, cartVariant);
    setOpen(true);
  };

  if (!purchasable) {
    return (
      <div className={cn("mt-10", className)}>
        <span
          className="inline-flex w-full cursor-default items-center justify-center border border-[var(--maison-charcoal)] bg-[var(--maison-charcoal)] px-7 py-2.5 font-sans text-[13px] font-normal tracking-normal text-[var(--maison-warm-white)] opacity-60 sm:w-auto sm:min-w-[12rem]"
          aria-disabled
        >
          {soldOut ? t("product.soldOut") : t("product.unavailable")}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("mt-10 space-y-8", className)}>
      {isRing ? (
        <RingSizeSelector
          product={product}
          selectedId={selectedVariant?.id ?? null}
          onSelect={setSelectedVariant}
        />
      ) : null}

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
            disabled={!canAdd || quantity >= maxStock}
            className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55 disabled:opacity-35"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button
          variant="solid"
          className={cn(
            "w-full sm:w-auto sm:min-w-[12rem]",
            (!canAdd || (isRing && !hasAvailableSize)) && "pointer-events-none opacity-45",
          )}
          onClick={handleAdd}
        >
          {t("product.addToCart")}
        </Button>
      </div>

      {isRing && !selectedVariant && hasAvailableSize ? (
        <p className="font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
          {t("product.ringSizeRequired")}
        </p>
      ) : null}
    </div>
  );
}
