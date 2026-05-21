"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/cart";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const { t, routes, locale } = useTranslations();
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  if (!mounted) return null;

  const currency = items[0]?.product.currency ?? "EUR";
  const total = subtotal();
  const isEmpty = items.length === 0;
  const close = () => setOpen(false);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70]",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label={t("nav.closeBag")}
        onClick={close}
        className={cn(
          "absolute inset-0 bg-[rgba(42,40,36,0.18)] transition-opacity duration-500 ease-[var(--ease-maison)]",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.shoppingBag")}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col",
          "border-l border-[var(--maison-hairline)] bg-[var(--maison-warm-white)]",
          "transition-transform duration-500 ease-[var(--ease-maison)] motion-reduce:transition-none",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between px-6 pt-7 pb-6 sm:px-8">
          <h2 className="font-sans text-[1.25rem] font-normal tracking-tight text-[var(--maison-charcoal)]">
            {t("cart.bag")}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label={t("nav.close")}
            className="flex h-10 w-10 items-center justify-center text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:text-[var(--maison-charcoal)]"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-start justify-center px-6 sm:px-8">
              <p className="font-sans text-[1.125rem] text-[var(--maison-charcoal)]">
                {t("cart.emptyTitle")}
              </p>
              <p className="mt-3 max-w-[14rem] font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-mist)]">
                {t("cart.emptyDescription")}
              </p>
              <Link
                href={routes.shop}
                onClick={close}
                className="mt-8 font-sans text-[var(--maison-chrome-size)] text-[var(--maison-charcoal)] underline-offset-4 transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-60"
              >
                {t("cart.continueShopping")}
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8">
                {items.map((item) => (
                  <CartLineItem key={item.product.id} item={item} onNavigate={close} />
                ))}
              </ul>

              <footer className="shrink-0 border-t border-[var(--maison-hairline)] px-6 py-8 sm:px-8">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-maison-label text-[var(--maison-mist)]">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-sans text-[0.9375rem] tabular-nums text-[var(--maison-charcoal)]">
                    {formatPrice(total, currency, locale)}
                  </span>
                </div>
                <p className="mt-2 font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
                  {t("cart.shippingNote")}
                </p>
                <Button
                  href={routes.checkout}
                  variant="solid"
                  className="mt-7 w-full"
                  onClick={close}
                >
                  {t("cart.checkout")}
                </Button>
                <button
                  type="button"
                  onClick={close}
                  className="mt-5 w-full text-center font-sans text-[0.75rem] tracking-[var(--tracking-label)] text-[var(--maison-mist)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:text-[var(--maison-charcoal)]"
                >
                  {t("cart.continueShopping")}
                </button>
              </footer>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
