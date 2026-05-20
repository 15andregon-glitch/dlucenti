import { sortCollectionsForStorefront } from "@/lib/collections-storefront";
import { editorialCollectionsFallback } from "@/lib/data/editorial-collections";
import type { Collection } from "@/lib/types";
import { useSupabaseDataSource } from "./data-source";

function publishedFallback(): Collection[] {
  return sortCollectionsForStorefront(editorialCollectionsFallback);
}

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
    () => publishedFallback(),
  );
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  return fromSupabase(
    async () => {
      const { getFeaturedCollections: get } = await import("./supabase/collections");
      return get();
    },
    () => publishedFallback().filter((c) => c.featured),
  );
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  return fromSupabase(
    async () => {
      const { getCollectionBySlug: get } = await import("./supabase/collections");
      return get(slug);
    },
    () => publishedFallback().find((c) => c.slug === slug) ?? null,
  );
}
