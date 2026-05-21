"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useTranslations } from "@/hooks/useTranslations";
import { formatPrice } from "@/lib/cart";
import { isProductPurchasable, isProductSoldOut } from "@/lib/product-availability";
import { useCartStore } from "@/store/cart";
import { ProductEditorialBadge } from "@/components/product/ProductEditorialBadge";
import { cn } from "@/lib/cn";

interface NewInProductCardProps {
  product: Product;
  className?: string;
}

const META_HEIGHT = "h-[3.375rem] md:h-[3.5rem]";

const quickAddLabel =
  "font-sans text-[0.6875rem] font-normal tracking-[var(--tracking-label)] text-[var(--hero-text-champagne)] drop-shadow-[0_1px_14px_rgba(42,40,36,0.22)] transition-opacity duration-500 ease-[var(--ease-maison)]";

export function NewInProductCard({ product, className }: NewInProductCardProps) {
  const { t, routes, locale } = useTranslations();
  const imageSrc = product.images[0];
  const soldOut = isProductSoldOut(product);
  const purchasable = isProductPurchasable(product);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!purchasable) return;
    addItem(product, 1);
    setOpen(true);
  };

  return (
    <article className={cn("group flex h-full min-h-0 flex-col", className)}>
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[var(--maison-warm-white)]">
        <Link
          href={routes.product(product.slug)}
          className="absolute inset-0 z-0"
          aria-label={`View ${product.name}`}
        >
          {soldOut ? (
            <ProductEditorialBadge
              label={t("product.soldOut")}
              variant="soldOut"
            />
          ) : (
            <ProductEditorialBadge label={t("product.newIn")} variant="new" />
          )}
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={90}
              className="object-cover object-center transition-[transform,opacity] duration-[800ms] ease-[var(--ease-maison)] group-hover:scale-[1.02] group-hover:opacity-[0.96] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--maison-surface-soft)]" aria-hidden />
          )}
        </Link>

        {purchasable ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`${t("product.addToBag")}: ${product.name}`}
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex min-h-[3rem] items-end justify-center pb-4",
              "transition-[opacity,transform] duration-500 ease-[var(--ease-maison)] motion-reduce:transition-none",
              "opacity-75 md:translate-y-0.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100",
              "active:opacity-100 md:hover:[&_span]:opacity-70",
            )}
          >
            <span className={quickAddLabel}>{t("product.addToBag")}</span>
          </button>
        ) : null}
      </div>

      <Link
        href={routes.product(product.slug)}
        className="mt-5 flex flex-col justify-between md:mt-6"
      >
        <div className={cn(META_HEIGHT)}>
          <h3 className="line-clamp-2 min-h-[2.53125rem] font-sans text-[0.9375rem] font-normal leading-[1.35] tracking-[var(--tracking-normal)] text-[var(--maison-charcoal)] transition-colors duration-500 ease-[var(--ease-maison)] group-hover:text-[var(--maison-gray)]">
            {product.name}
          </h3>
          <p className="font-sans text-[0.8125rem] font-normal tabular-nums leading-none tracking-[var(--tracking-normal)] text-[var(--maison-gray)]">
            {formatPrice(product.price, product.currency, locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}
