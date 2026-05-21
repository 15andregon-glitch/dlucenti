import { createSupabasePublicClient } from "@/lib/supabase/public";
import { filterHomepageProducts } from "@/lib/product-editorial-visibility";
import {
  mapCampaignRow,
  mapCollectionRow,
  mapProductWithCollection,
  type CampaignFrame,
} from "@/lib/supabase/mappers";
import type { Product, Collection } from "@/lib/types";
import type { CollectionRow, HomepageSettingsRow } from "@/types/database";
import {
  fetchActiveCampaigns,
  fetchHomepageNewIn,
  fetchHomepageSettings,
} from "@/queries/homepage";
import type { ProductWithCollection } from "@/types/database";

export type { CampaignFrame };

export type HomepageContent = {
  settings: HomepageSettingsRow | null;
  newIn: Product[];
  campaigns: CampaignFrame[];
  featuredCollection: Collection | null;
};

type SettingsWithCollection = HomepageSettingsRow & {
  collections?: CollectionRow | null;
};

export async function getHomepageContent(): Promise<HomepageContent> {
  const client = createSupabasePublicClient();

  const [settingsRes, newInRes, campaignsRes] = await Promise.all([
    fetchHomepageSettings(client),
    fetchHomepageNewIn(client),
    fetchActiveCampaigns(client),
  ]);

  if (settingsRes.error) throw settingsRes.error;
  if (newInRes.error) throw newInRes.error;
  if (campaignsRes.error) throw campaignsRes.error;

  const settingsRow = settingsRes.data as SettingsWithCollection | null;
  const featuredCollection = settingsRow?.collections
    ? mapCollectionRow(settingsRow.collections)
    : null;

  return {
    settings: settingsRow
      ? {
          id: settingsRow.id,
          hero_video_url: settingsRow.hero_video_url,
          featured_collection_id: settingsRow.featured_collection_id,
          updated_at: settingsRow.updated_at,
        }
      : null,
    newIn: filterHomepageProducts(newInRes.data ?? []).map((row) =>
      mapProductWithCollection(row as ProductWithCollection),
    ),
    campaigns: (campaignsRes.data ?? []).map((row, i) =>
      mapCampaignRow(row, `Campaign frame ${i + 1}`),
    ),
    featuredCollection,
  };
}

export async function getHeroVideoUrl(): Promise<string | null> {
  const { settings } = await getHomepageContent();
  return settings?.hero_video_url ?? null;
}

export async function getHomepageNewInProducts(): Promise<Product[]> {
  const { newIn } = await getHomepageContent();
  return newIn;
}

export async function getCampaignGallery(): Promise<CampaignFrame[]> {
  const { campaigns } = await getHomepageContent();
  return campaigns;
}
