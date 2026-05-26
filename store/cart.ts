import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLineVariant } from "@/lib/product-availability";
import {
  cartVariantFromProductVariant,
  getProductStock,
  isCartLinePurchasable,
  isProductPurchasable,
} from "@/lib/product-availability";
import { getCartLineKey, isRingProduct } from "@/lib/product-variants";
import { roundMoney } from "@/lib/prices";
import type { Product } from "@/lib/types";
import type { ProductCategory } from "@/lib/types";
import type { ProductTargetGender } from "@/types/database/schema";

export type { CartLineVariant };

export interface CartItem {
  lineKey: string;
  product: Product;
  quantity: number;
  variant?: CartLineVariant;
}

export interface CartPriceRefreshPayload {
  lineKey: string;
  id: string;
  variantId?: string;
  price: number;
  stock: number;
  name: string;
  slug: string;
  currency: string;
  images: string[];
  category: ProductCategory;
  targetGender: ProductTargetGender;
  variants?: Array<{
    id: string;
    label: string;
    sku: string | null;
    stock: number;
    isActive: boolean;
    sortOrder: number;
  }>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product,
    quantity?: number,
    variant?: CartLineVariant,
  ) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  syncPricesFromServer: (updates: CartPriceRefreshPayload[]) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  totalItems: () => number;
  subtotal: () => number;
}

function buildCartItem(
  product: Product,
  quantity: number,
  variant?: CartLineVariant,
): CartItem {
  const lineKey = getCartLineKey(product.id, variant?.id);
  return { lineKey, product, quantity, variant };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1, variant) =>
        set((state) => {
          if (isRingProduct(product) && !variant) {
            return state;
          }
          if (!isCartLinePurchasable(product, variant)) {
            return state;
          }
          const lineKey = getCartLineKey(product.id, variant?.id);
          const maxQty = getProductStock(product, variant);
          const existing = state.items.find((i) => i.lineKey === lineKey);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, maxQty);
            return {
              items: state.items.map((i) =>
                i.lineKey === lineKey ? { ...i, quantity: nextQty } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              buildCartItem(
                product,
                Math.min(quantity, maxQty),
                variant,
              ),
            ],
          };
        }),
      removeItem: (lineKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.lineKey !== lineKey),
        })),
      updateQuantity: (lineKey, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.lineKey === lineKey);
          if (!item) return state;
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.lineKey !== lineKey),
            };
          }
          const maxQty = getProductStock(item.product, item.variant);
          return {
            items: state.items.map((i) =>
              i.lineKey === lineKey
                ? { ...i, quantity: Math.min(quantity, maxQty) }
                : i,
            ),
          };
        }),
      syncPricesFromServer: (updates) =>
        set((state) => {
          if (updates.length === 0) return state;
          const byLineKey = new Map(updates.map((u) => [u.lineKey, u]));
          return {
            items: state.items.map((item) => {
              const fresh = byLineKey.get(item.lineKey);
              if (!fresh) return item;

              const productVariants = fresh.variants?.map((v) => ({
                id: v.id,
                label: v.label,
                sku: v.sku,
                stock: v.stock,
                isActive: v.isActive,
                sortOrder: v.sortOrder,
              }));

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
                ...(productVariants ? { variants: productVariants } : {}),
              };

              let variant = item.variant;
              if (variant && productVariants) {
                const match = productVariants.find((v) => v.id === variant!.id);
                if (match) {
                  variant = cartVariantFromProductVariant(match);
                }
              } else if (variant) {
                variant = {
                  ...variant,
                  stock: fresh.stock,
                };
              }

              const maxQty = getProductStock(product, variant);
              return {
                ...item,
                product,
                variant,
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
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { items?: Array<Record<string, unknown>> };
        if (!state?.items) return persisted;
        return {
          ...state,
          items: state.items.map((item) => {
            const product = item.product as Product;
            const variant = item.variant as CartLineVariant | undefined;
            const lineKey =
              (item.lineKey as string | undefined) ??
              getCartLineKey(product.id, variant?.id);
            return { ...item, lineKey, product, variant };
          }),
        };
      },
    },
  ),
);

/** @deprecated Use isCartLinePurchasable for cart lines */
export { isProductPurchasable };
