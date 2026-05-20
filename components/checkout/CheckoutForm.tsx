"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { CheckoutField } from "./CheckoutField";

const COUNTRY_CODES = ["FR", "GB", "US", "IT", "DE", "PT"] as const;

export function CheckoutForm() {
  const { t, routes } = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0 && !submitted) {
    return (
      <div className="py-16">
        <p className="font-serif text-[1.25rem] text-[var(--maison-charcoal)]">
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

  if (submitted) {
    return (
      <div className="py-8">
        <p className="font-serif text-[clamp(1.5rem,3vw,1.875rem)] font-normal leading-snug tracking-tight text-[var(--maison-charcoal)]">
          {t("checkout.thankYou")}
        </p>
        <p className="mt-5 max-w-md font-sans text-[0.875rem] leading-[1.7] text-[var(--maison-gray)]">
          {t("checkout.confirmation")}
        </p>
        <Button href={routes.shop} variant="outline" className="mt-10">
          {t("cart.continueShopping")}
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-14">
      <section>
        <h2 className="text-maison-label text-[var(--maison-mist)]">{t("checkout.contact")}</h2>
        <div className="mt-6">
          <CheckoutField
            id="email"
            label={t("checkout.email")}
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </section>

      <section>
        <h2 className="text-maison-label text-[var(--maison-mist)]">{t("checkout.delivery")}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <CheckoutField
            id="firstName"
            label={t("checkout.firstName")}
            autoComplete="given-name"
            required
          />
          <CheckoutField
            id="lastName"
            label={t("checkout.lastName")}
            autoComplete="family-name"
            required
          />
          <CheckoutField
            id="address"
            label={t("checkout.address")}
            autoComplete="street-address"
            className="sm:col-span-2"
            required
          />
          <CheckoutField
            id="city"
            label={t("checkout.city")}
            autoComplete="address-level2"
            required
          />
          <CheckoutField
            id="postal"
            label={t("checkout.postalCode")}
            autoComplete="postal-code"
            required
          />
          <CheckoutField id="country" label={t("checkout.country")} as="select" required>
            <option value="">{t("checkout.selectCountry")}</option>
            {COUNTRY_CODES.map((code) => (
              <option key={code} value={code}>
                {t(`countries.${code}`)}
              </option>
            ))}
          </CheckoutField>
        </div>
      </section>

      <section>
        <h2 className="text-maison-label text-[var(--maison-mist)]">{t("checkout.payment")}</h2>
        <p className="mt-3 font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
          {t("checkout.paymentNote")}
        </p>
        <div className="mt-6 space-y-6">
          <CheckoutField
            id="cardName"
            label={t("checkout.cardName")}
            autoComplete="cc-name"
            required
          />
          <CheckoutField
            id="cardNumber"
            label={t("checkout.cardNumber")}
            autoComplete="cc-number"
            required
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <CheckoutField
              id="expiry"
              label={t("checkout.expiry")}
              autoComplete="cc-exp"
              required
            />
            <CheckoutField
              id="cvc"
              label={t("checkout.securityCode")}
              autoComplete="cc-csc"
              required
            />
          </div>
        </div>
      </section>

      <Button type="submit" variant="solid" className="w-full sm:w-auto sm:min-w-[14rem]">
        {t("checkout.placeOrder")}
      </Button>
    </form>
  );
}
