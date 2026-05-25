import { SITE } from "@/lib/constants";
import { roundMoney } from "@/lib/prices";
import { mapEditorialCollection } from "@/lib/supabase/collection-mapper";
import type { Collection } from "@/lib/types";
import type { Product, ProductCategory } from "@/lib/types";
import type {
  CampaignRow,
  CollectionBlockRow,
  CollectionMediaRow,
  CollectionRow,
  ProductImageRow,
  ProductRow,
  ProductWithCollection,
  ProductWithImages,
} from "@/types/database";

type CollectionWithRelations = CollectionRow & {
  collection_media?: CollectionMediaRow[];
  collection_blocks?: CollectionBlockRow[];
};

function sortImages(images: ProductImageRow[]): ProductImageRow[] {
  return [...images].sort((a, b) => a.position - b.position);
}

/** Map DB row (+ images, optional collection) → frontend Product */
export function mapProductRow(
  row: ProductRow,
  images: ProductImageRow[],
  collection?: CollectionRow | null,
): Product {
  const sorted = sortImages(images);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: roundMoney(Number(row.price)),
    currency: SITE.currency,
    category: row.category as ProductCategory,
    targetGender: row.target_gender ?? "unisex",
    collectionSlug: collection?.slug ?? undefined,
    images: sorted.map((img) => img.image_url),
    featured: row.featured,
    isNew: row.new_in,
    stock: Number(row.stock ?? 0),
  };
}

export function mapProductWithImages(row: ProductWithImages): Product {
  return mapProductRow(row, row.product_images);
}

export function mapProductWithCollection(row: ProductWithCollection): Product {
  return mapProductRow(row, row.product_images, row.collections);
}

export function mapCollectionRow(row: CollectionRow | CollectionWithRelations): Collection {
  const media =
    "collection_media" in row && Array.isArray(row.collection_media)
      ? row.collection_media
      : [];
  const blocks =
    "collection_blocks" in row && Array.isArray(row.collection_blocks)
      ? row.collection_blocks
      : [];
  return mapEditorialCollection(row, media, blocks);
}

export interface CampaignFrame {
  id: string;
  src: string;
  alt: string;
}

export function mapCampaignRow(
  row: CampaignRow,
  alt = "Campaign",
): CampaignFrame {
  return {
    id: row.id,
    src: row.image_url,
    alt,
  };
}
