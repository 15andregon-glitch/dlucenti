"use client";

import { useEffect, useRef } from "react";
import type { ProductCategory } from "@/lib/types";
import type { ProductTargetGender } from "@/types/database/schema";
import { useCartStore } from "@/store/cart";

/** Re-fetch live prices from the database when the cart is shown */
export function useRefreshCartPrices(active: boolean) {
  const syncPricesFromServer = useCartStore((s) => s.syncPricesFromServer);
  const itemIds = useCartStore((s) => s.items.map((i) => i.product.id).join(","));
  const inFlight = useRef(false);

  useEffect(() => {
    if (!active || !itemIds) return;

    const productIds = itemIds.split(",").filter(Boolean);
    if (productIds.length === 0) return;

    if (inFlight.current) return;
    inFlight.current = true;

    fetch("/api/cart/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as {
          products?: Array<{
            id: string;
            price: number;
            stock: number;
            name: string;
            slug: string;
            currency: string;
            images: string[];
            category: string;
            targetGender: string;
          }>;
        };
        if (data.products?.length) {
          syncPricesFromServer(
            data.products.map((p) => ({
              ...p,
              category: p.category as ProductCategory,
              targetGender: p.targetGender as ProductTargetGender,
            })),
          );
        }
      })
      .catch(() => {
        /* keep cached prices on network error */
      })
      .finally(() => {
        inFlight.current = false;
      });
  }, [active, itemIds, syncPricesFromServer]);
}
