"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { CheckoutField } from "./CheckoutField";

export function CheckoutForm() {
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
          Your bag is empty
        </p>
        <Link
          href={ROUTES.shop}
          className="mt-6 inline-block font-sans text-[var(--maison-chrome-size)] text-[var(--maison-charcoal)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-60"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="py-8">
        <p className="font-serif text-[clamp(1.5rem,3vw,1.875rem)] font-normal leading-snug tracking-tight text-[var(--maison-charcoal)]">
          Thank you
        </p>
        <p className="mt-5 max-w-md font-sans text-[0.875rem] leading-[1.7] text-[var(--maison-gray)]">
          Your order has been received. A confirmation will arrive shortly.
        </p>
        <Button href={ROUTES.shop} variant="outline" className="mt-10">
          Continue shopping
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
        <h2 className="text-maison-label text-[var(--maison-mist)]">Contact</h2>
        <div className="mt-6">
          <CheckoutField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </section>

      <section>
        <h2 className="text-maison-label text-[var(--maison-mist)]">Delivery</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <CheckoutField
            id="firstName"
            label="First name"
            autoComplete="given-name"
            required
          />
          <CheckoutField
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            required
          />
          <CheckoutField
            id="address"
            label="Address"
            autoComplete="street-address"
            className="sm:col-span-2"
            required
          />
          <CheckoutField id="city" label="City" autoComplete="address-level2" required />
          <CheckoutField
            id="postal"
            label="Postal code"
            autoComplete="postal-code"
            required
          />
          <CheckoutField id="country" label="Country" as="select" required>
            <option value="">Select</option>
            <option value="FR">France</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="IT">Italy</option>
            <option value="DE">Germany</option>
          </CheckoutField>
        </div>
      </section>

      <section>
        <h2 className="text-maison-label text-[var(--maison-mist)]">Payment</h2>
        <p className="mt-3 font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
          Secure checkout — demo environment.
        </p>
        <div className="mt-6 space-y-6">
          <CheckoutField
            id="cardName"
            label="Name on card"
            autoComplete="cc-name"
            required
          />
          <CheckoutField
            id="cardNumber"
            label="Card number"
            autoComplete="cc-number"
            required
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <CheckoutField id="expiry" label="Expiry" autoComplete="cc-exp" required />
            <CheckoutField
              id="cvc"
              label="Security code"
              autoComplete="cc-csc"
              required
            />
          </div>
        </div>
      </section>

      <Button type="submit" variant="solid" className="w-full sm:w-auto sm:min-w-[14rem]">
        Place order
      </Button>
    </form>
  );
}
