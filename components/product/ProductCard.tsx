"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useTranslations } from "@/hooks/useTranslations";
import { formatPrice } from "@/lib/cart";
import { cn } from "@/lib/cn";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const META_BLOCK_CLASS =
  "mt-5 flex h-[5.625rem] flex-col justify-between md:mt-6 md:h-[5.75rem]";

export function ProductCard({ product, className }: ProductCardProps) {
  const { routes, locale } = useTranslations();
  const imageSrc = product.images[0];

  return (
    <article className={cn("group flex h-full min-h-0", className)}>
      <Link
        href={routes.product(product.slug)}
        className="flex h-full min-h-0 w-full flex-col"
      >
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[var(--maison-warm-white)]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover object-center transition-[transform,opacity] duration-[900ms] ease-[var(--ease-maison)] group-hover:scale-[1.02] group-hover:opacity-[0.94] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--maison-surface-soft)]">
              <span className="text-maison-label text-[var(--maison-mist)]">
                {product.name}
              </span>
            </div>
          )}
        </div>

        <div className={META_BLOCK_CLASS}>
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 min-h-[2.53125rem] font-sans text-[0.9375rem] font-normal leading-[1.35] tracking-[var(--tracking-normal)] text-[var(--maison-charcoal)] transition-colors duration-500 ease-[var(--ease-maison)] group-hover:text-[var(--maison-gray)]">
              {product.name}
            </h3>
            <p
              className={cn(
                "line-clamp-1 min-h-[1.3125rem] text-maison-body-sm leading-[1.35] text-[var(--maison-mist)]",
                !product.subtitle && "invisible",
              )}
              aria-hidden={!product.subtitle}
            >
              {product.subtitle ?? "\u00a0"}
            </p>
          </div>
          <p className="font-sans text-[0.8125rem] font-normal tabular-nums leading-none tracking-[var(--tracking-normal)] text-[var(--maison-gray)]">
            {formatPrice(product.price, product.currency, locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}
