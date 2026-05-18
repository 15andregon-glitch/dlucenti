import { products } from "@/lib/data/products";
import type { Product, ProductCategory } from "@/lib/types";
import { useSupabaseDataSource } from "./data-source";

const NEW_IN_CATEGORY_ORDER: ProductCategory[] = [
  "necklaces",
  "bracelets",
  "earrings",
  "rings",
];

async function fromSupabase<T>(
  loader: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (!useSupabaseDataSource()) {
    return fallback();
  }
  return loader();
}

export async function getProducts(): Promise<Product[]> {
  return fromSupabase(
    async () => {
      const { getProducts: get } = await import("./supabase/products");
      return get();
    },
    () => products,
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return fromSupabase(
    async () => {
      const { getFeaturedProducts: get } = await import("./supabase/products");
      return get();
    },
    () => products.filter((p) => p.featured),
  );
}

/** Homepage New In row — CMS order when Supabase is active */
export async function getNewInProducts(): Promise<Product[]> {
  return fromSupabase(
    async () => {
      const { getNewInProducts: get } = await import("./supabase/products");
      return get();
    },
    () =>
      NEW_IN_CATEGORY_ORDER.flatMap((category) => {
        const product = products.find((p) => p.category === category);
        return product ? [product] : [];
      }),
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return fromSupabase(
    async () => {
      const { getProductBySlug: get } = await import("./supabase/products");
      return get(slug);
    },
    () => products.find((p) => p.slug === slug) ?? null,
  );
}

export async function getProductsByCollection(
  collectionSlug: string,
): Promise<Product[]> {
  return fromSupabase(
    async () => {
      const { getProductsByCollection: get } = await import(
        "./supabase/products"
      );
      return get(collectionSlug);
    },
    () => products.filter((p) => p.collectionSlug === collectionSlug),
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  return fromSupabase(
    async () => {
      const { getRelatedProducts: get } = await import("./supabase/products");
      return get(product, limit);
    },
    () =>
      products
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.category === product.category ||
              p.collectionSlug === product.collectionSlug),
        )
        .slice(0, limit),
  );
}
