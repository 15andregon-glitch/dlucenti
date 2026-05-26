"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart";

/** Re-fetch live prices and stock from the database when the cart is shown */
export function useRefreshCartPrices(active: boolean) {
  const syncPricesFromServer = useCartStore((s) => s.syncPricesFromServer);
  const items = useCartStore((s) => s.items);
  const lineSignature = items
    .map((i) => `${i.lineKey}:${i.quantity}`)
    .join("|");
  const inFlight = useRef(false);

  useEffect(() => {
    if (!active || !lineSignature) return;

    const lines = items.map((item) => ({
      productId: item.product.id,
      variantId: item.variant?.id,
    }));

    if (lines.length === 0) return;

    if (inFlight.current) return;
    inFlight.current = true;

    fetch("/api/cart/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as {
          products?: Parameters<typeof syncPricesFromServer>[0];
        };
        if (data.products?.length) {
          syncPricesFromServer(data.products);
        }
      })
      .catch(() => {
        /* keep cached prices on network error */
      })
      .finally(() => {
        inFlight.current = false;
      });
  }, [active, lineSignature, items, syncPricesFromServer]);
}
