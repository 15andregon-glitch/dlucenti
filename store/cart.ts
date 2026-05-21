import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getProductStock,
  isProductPurchasable,
} from "@/lib/product-availability";
import type { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) =>
        set((state) => {
          if (!isProductPurchasable(product)) {
            return state;
          }
          const maxQty = getProductStock(product);
          const existing = state.items.find(
            (i) => i.product.id === product.id,
          );
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, maxQty);
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: nextQty }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, maxQty) },
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          if (!item) return state;
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          const maxQty = getProductStock(item.product);
          return {
            items: state.items.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: Math.min(quantity, maxQty) }
                : i,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),
    }),
    {
      name: "maison-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
