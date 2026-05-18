import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import * as productMutations from "@/queries/mutations/products";
import * as collectionMutations from "@/queries/mutations/collections";
import * as homepageMutations from "@/queries/mutations/homepage";
import * as campaignMutations from "@/queries/mutations/campaigns";
import * as storageMutations from "@/queries/mutations/storage";
import type { StorageBucket } from "@/lib/supabase/storage";

/**
 * Admin / CMS mutations — use service role (server-only).
 * Wire these from dashboard route handlers or Server Actions.
 */

function admin() {
  return createSupabaseAdminClient();
}

export const adminProducts = {
  create: (row: TablesInsert<"products">) => productMutations.insertProduct(admin(), row),
  update: (id: string, row: TablesUpdate<"products">) =>
    productMutations.updateProduct(admin(), id, row),
  remove: (id: string) => productMutations.deleteProduct(admin(), id),
  upsertImages: (rows: TablesInsert<"product_images">[]) =>
    productMutations.upsertProductImages(admin(), rows),
};

export const adminCollections = {
  create: (row: TablesInsert<"collections">) =>
    collectionMutations.insertCollection(admin(), row),
  update: (id: string, row: TablesUpdate<"collections">) =>
    collectionMutations.updateCollection(admin(), id, row),
  remove: (id: string) => collectionMutations.deleteCollection(admin(), id),
};

export const adminHomepage = {
  updateSettings: (
    row: TablesInsert<"homepage_settings"> | TablesUpdate<"homepage_settings">,
  ) => homepageMutations.upsertHomepageSettings(admin(), row),
  setNewIn: (items: { product_id: string; position: number }[]) =>
    homepageMutations.setHomepageNewIn(admin(), items),
};

export const adminCampaigns = {
  create: (row: TablesInsert<"campaigns">) =>
    campaignMutations.insertCampaign(admin(), row),
  update: (id: string, row: TablesUpdate<"campaigns">) =>
    campaignMutations.updateCampaign(admin(), id, row),
  remove: (id: string) => campaignMutations.deleteCampaign(admin(), id),
  reorder: (ordered: { id: string; position: number }[]) =>
    campaignMutations.reorderCampaigns(admin(), ordered),
};

export const adminStorage = {
  upload: (
    bucket: StorageBucket,
    path: string,
    file: File | Blob,
    options?: { upsert?: boolean; contentType?: string },
  ) => storageMutations.uploadStorageObject(admin(), bucket, path, file, options),
  remove: (bucket: StorageBucket, paths: string[]) =>
    storageMutations.removeStorageObject(admin(), bucket, paths),
  publicUrl: (bucket: StorageBucket, path: string) =>
    storageMutations.getPublicUrl(admin(), bucket, path),
};

/** Namespace for server actions */
export const supabaseAdmin = {
  adminProducts,
  adminCollections,
  adminHomepage,
  adminCampaigns,
  adminStorage,
};
