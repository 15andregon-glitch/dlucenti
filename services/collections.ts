import { collections } from "@/lib/data/collections";
import type { Collection } from "@/lib/types";
import { useSupabaseDataSource } from "./data-source";

async function fromSupabase<T>(
  loader: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (!useSupabaseDataSource()) {
    return fallback();
  }
  return loader();
}

export async function getCollections(): Promise<Collection[]> {
  return fromSupabase(
    async () => {
      const { getCollections: get } = await import("./supabase/collections");
      return get();
    },
    () => collections,
  );
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  return fromSupabase(
    async () => {
      const { getFeaturedCollections: get } = await import(
        "./supabase/collections"
      );
      return get();
    },
    () => collections.filter((c) => c.featured),
  );
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  return fromSupabase(
    async () => {
      const { getCollectionBySlug: get } = await import(
        "./supabase/collections"
      );
      return get(slug);
    },
    () => collections.find((c) => c.slug === slug) ?? null,
  );
}
