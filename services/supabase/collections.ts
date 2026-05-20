import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sortCollectionsForStorefront } from "@/lib/collections-storefront";
import { mapCollectionRow } from "@/lib/supabase/mappers";
import type { Collection } from "@/lib/types";
import {
  fetchFeaturedCollections,
  fetchPublishedCollectionBySlug,
  fetchPublishedCollections,
} from "@/queries/collections";

export async function getCollections(): Promise<Collection[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchPublishedCollections(client);
  if (error) throw error;
  return (data ?? []).map(mapCollectionRow);
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchFeaturedCollections(client);
  if (error) throw error;
  return (data ?? []).map(mapCollectionRow);
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  const client = await createSupabaseServerClient();
  const { data, error } = await fetchPublishedCollectionBySlug(client, slug);
  if (error) throw error;
  if (!data) return null;
  return mapCollectionRow(data);
}
