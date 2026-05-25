"use client";

import { useState } from "react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { StripeCheckout } from "@/components/checkout/StripeCheckout";
import { DEFAULT_SHIPPING_COUNTRY } from "@/lib/shipping";

export function CheckoutExperience() {
  const [shippingCountry, setShippingCountry] = useState(DEFAULT_SHIPPING_COUNTRY);

  return (
    <>
      <div className="min-w-0 max-w-xl">
        <StripeCheckout shippingCountry={shippingCountry} />
      </div>
      <div className="border-t border-[var(--maison-hairline)] pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:pl-16">
        <OrderSummary
          shippingCountry={shippingCountry}
          onShippingCountryChange={setShippingCountry}
        />
      </div>
    </>
  );
}
