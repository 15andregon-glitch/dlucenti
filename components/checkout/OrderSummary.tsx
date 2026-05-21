"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/cart";

export function OrderSummary() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) return null;

  const currency = items[0]?.product.currency ?? "EUR";
  const total = subtotal();

  return (
    <aside className="lg:sticky lg:top-28">
      <p className="text-maison-label text-[var(--maison-mist)]">Order summary</p>

      <ul className="mt-8 space-y-6">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-4">
            <div className="relative aspect-[3/4] w-[4.5rem] shrink-0 overflow-hidden bg-[var(--maison-warm-white)]">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="72px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--maison-champagne)]" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-sans text-[1rem] leading-snug text-[var(--maison-charcoal)]">
                {product.name}
              </p>
              <p className="mt-1 font-sans text-[0.75rem] text-[var(--maison-mist)]">
                Qty {quantity}
              </p>
              <p className="mt-2 font-sans text-[0.8125rem] tabular-nums text-[var(--maison-charcoal)]">
                {formatPrice(product.price * quantity, product.currency)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 space-y-3 border-t border-[var(--maison-hairline)] pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
            Subtotal
          </span>
          <span className="font-sans text-[0.8125rem] tabular-nums text-[var(--maison-charcoal)]">
            {formatPrice(total, currency)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
            Shipping
          </span>
          <span className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
            Complimentary
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4 pt-3">
          <span className="font-sans text-[0.875rem] text-[var(--maison-charcoal)]">
            Total
          </span>
          <span className="font-sans text-[0.9375rem] tabular-nums text-[var(--maison-charcoal)]">
            {formatPrice(total, currency)}
          </span>
        </div>
      </div>

      <p className="mt-8 font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
        All orders are carefully prepared and dispatched within 3–5 business days.
      </p>
    </aside>
  );
}
