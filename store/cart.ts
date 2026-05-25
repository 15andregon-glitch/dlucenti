import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getProductStock,
  isProductPurchasable,
} from "@/lib/product-availability";
import { roundMoney } from "@/lib/prices";
import type { Product } from "@/lib/types";
import type { ProductCategory } from "@/lib/types";
import type { ProductTargetGender } from "@/types/database/schema";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartPriceRefreshPayload {
  id: string;
  price: number;
  stock: number;
  name: string;
  slug: string;
  currency: string;
  images: string[];
  category: ProductCategory;
  targetGender: ProductTargetGender;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  syncPricesFromServer: (updates: CartPriceRefreshPayload[]) => void;
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
      syncPricesFromServer: (updates) =>
        set((state) => {
          if (updates.length === 0) return state;
          const byId = new Map(updates.map((u) => [u.id, u]));
          return {
            items: state.items.map((item) => {
              const fresh = byId.get(item.product.id);
              if (!fresh) return item;
              const product: Product = {
                ...item.product,
                price: roundMoney(fresh.price),
                stock: fresh.stock,
                name: fresh.name,
                slug: fresh.slug,
                currency: fresh.currency,
                images: fresh.images,
                category: fresh.category,
                targetGender: fresh.targetGender,
              };
              const maxQty = getProductStock(product);
              return {
                product,
                quantity: Math.min(item.quantity, maxQty),
              };
            }),
          };
        }),
      clearCart: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        roundMoney(
          get().items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
          ),
        ),
    }),
    {
      name: "maison-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
