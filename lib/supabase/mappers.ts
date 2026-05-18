import { SITE } from "@/lib/constants";
import type { Collection } from "@/lib/types";
import type { Product, ProductCategory } from "@/lib/types";
import type {
  CampaignRow,
  CollectionRow,
  ProductImageRow,
  ProductRow,
  ProductWithCollection,
  ProductWithImages,
} from "@/types/database";

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
    price: Number(row.price),
    currency: SITE.currency,
    category: row.category as ProductCategory,
    collectionSlug: collection?.slug ?? undefined,
    images: sorted.map((img) => img.image_url),
    featured: row.featured,
    isNew: row.new_in,
  };
}

export function mapProductWithImages(row: ProductWithImages): Product {
  return mapProductRow(row, row.product_images);
}

export function mapProductWithCollection(row: ProductWithCollection): Product {
  return mapProductRow(row, row.product_images, row.collections);
}

export function mapCollectionRow(row: CollectionRow): Collection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    season: "",
    description: row.description,
    coverImage: row.cover_image,
    featured: row.featured,
  };
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
