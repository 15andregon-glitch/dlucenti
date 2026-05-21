"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart";

export function ClearCartOnSuccess({ sessionId }: { sessionId?: string }) {
  const cleared = useRef(false);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (!sessionId || cleared.current) return;
    cleared.current = true;
    clearCart();
  }, [sessionId, clearCart]);

  return null;
}
