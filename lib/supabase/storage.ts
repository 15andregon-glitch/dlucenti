import { getSupabaseUrl } from "./env";

/** Storage bucket names — must match supabase/storage.sql */
export const STORAGE_BUCKETS = {
  products: "products",
  campaigns: "campaigns",
  videos: "videos",
  collections: "collections",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/** Public URL for a file in a Supabase Storage bucket */
export function getStoragePublicUrl(bucket: StorageBucket, path: string): string {
  const base = getSupabaseUrl().replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

/** Upload path helper: products/{productId}/{filename} */
export function productImagePath(productId: string, filename: string): string {
  return `${productId}/${filename}`;
}

export function campaignImagePath(filename: string): string {
  return filename;
}

export function collectionCoverPath(collectionId: string, filename: string): string {
  return `${collectionId}/${filename}`;
}

export function heroVideoPath(filename: string): string {
  return filename;
}
