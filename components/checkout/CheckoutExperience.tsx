"use client";

import { OrderSummary } from "@/components/checkout/OrderSummary";
import { StripeCheckout } from "@/components/checkout/StripeCheckout";

export function CheckoutExperience() {
  return (
    <>
      <div className="min-w-0 max-w-2xl">
        <StripeCheckout />
      </div>
      <div className="border-t border-[var(--maison-hairline)] pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:pl-16">
        <OrderSummary />
      </div>
    </>
  );
}
