"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/store/cart";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/cart";
import { ROUTES } from "@/lib/routes";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

interface CartLineItemProps {
  item: CartItem;
  onNavigate?: () => void;
}

export function CartLineItem({ item, onNavigate }: CartLineItemProps) {
  const { locale } = useTranslations();
  const { product, quantity } = item;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const imageSrc = product.images[0];

  return (
    <li className="flex gap-5 border-b border-[var(--maison-hairline)] py-8 first:pt-0 last:border-b-0">
      <Link
        href={ROUTES.product(product.slug)}
        onClick={onNavigate}
        className="relative block aspect-[3/4] w-[5.5rem] shrink-0 overflow-hidden bg-[var(--maison-warm-white)] sm:w-[6.25rem]"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="100px"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--maison-champagne)]" aria-hidden />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <Link
            href={ROUTES.product(product.slug)}
            onClick={onNavigate}
            className="block font-editorial text-maison-title text-[1.0625rem] leading-snug transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-65"
          >
            {product.name}
          </Link>
          {product.subtitle && (
            <p className="mt-1 font-sans text-[0.8125rem] text-[var(--maison-mist)]">
              {product.subtitle}
            </p>
          )}
          <p className="mt-2 font-sans text-[0.8125rem] tabular-nums text-[var(--maison-charcoal)]">
            {formatPrice(product.price, product.currency, locale)}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div
            className="inline-flex items-center gap-4"
            aria-label={`Quantity for ${product.name}`}
          >
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[1rem] text-center font-sans text-[var(--maison-chrome-size)] tabular-nums text-[var(--maison-charcoal)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className={cn(
              "font-sans text-[0.75rem] tracking-[var(--tracking-label)] text-[var(--maison-mist)]",
              "transition-opacity duration-500 ease-[var(--ease-maison)] hover:text-[var(--maison-charcoal)]",
            )}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
