"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { getActiveRingVariants } from "@/lib/product-variants";
import type { Product, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/cn";

interface RingSizeSelectorProps {
  product: Product;
  selectedId: string | null;
  onSelect: (variant: ProductVariant) => void;
  className?: string;
}

export function RingSizeSelector({
  product,
  selectedId,
  onSelect,
  className,
}: RingSizeSelectorProps) {
  const { t } = useTranslations();
  const sizes = getActiveRingVariants(product.variants);

  if (sizes.length === 0) {
    return (
      <p
        className={cn(
          "font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-mist)]",
          className,
        )}
      >
        {t("product.ringSizesUnavailable")}
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-maison-label text-[var(--maison-mist)]">
          {t("product.selectRingSize")}
        </p>
        {selectedId ? (
          <p className="font-sans text-[0.75rem] tracking-[var(--tracking-label)] text-[var(--maison-charcoal)]">
            {t("product.ringSize")}{" "}
            <span className="tabular-nums">
              {sizes.find((s) => s.id === selectedId)?.label}
            </span>
          </p>
        ) : null}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={t("product.selectRingSize")}
      >
        {sizes.map((size) => {
          const outOfStock = size.stock <= 0;
          const selected = selectedId === size.id;
          return (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={outOfStock}
              onClick={() => onSelect(size)}
              className={cn(
                "min-w-[2.75rem] border px-3.5 py-2 font-sans text-[0.8125rem] tabular-nums tracking-[0.04em] transition-[border-color,background-color,color,opacity] duration-500 ease-[var(--ease-maison)]",
                selected
                  ? "border-[var(--maison-charcoal)] bg-[var(--maison-charcoal)] text-[var(--maison-warm-white)]"
                  : "border-[var(--maison-hairline)] bg-transparent text-[var(--maison-charcoal)] hover:border-[var(--maison-charcoal)]",
                outOfStock &&
                  "cursor-not-allowed border-[var(--maison-hairline)] text-[var(--maison-mist)] opacity-45 hover:border-[var(--maison-hairline)]",
              )}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
