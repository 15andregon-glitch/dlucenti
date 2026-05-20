import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import * as productMutations from "@/queries/mutations/products";
import * as collectionMutations from "@/queries/mutations/collections";
import * as collectionEditorialMutations from "@/queries/mutations/collection-editorial";
import * as homepageMutations from "@/queries/mutations/homepage";
import * as campaignMutations from "@/queries/mutations/campaigns";
import * as footerMutations from "@/queries/mutations/footer";
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
  reorder: (ordered: { id: string; display_order: number }[]) =>
    collectionEditorialMutations.reorderCollections(admin(), ordered),
  addMedia: (row: TablesInsert<"collection_media">) =>
    collectionEditorialMutations.insertCollectionMedia(admin(), row),
  removeMedia: (id: string) =>
    collectionEditorialMutations.deleteCollectionMedia(admin(), id),
  reorderMedia: (ordered: { id: string; position: number }[]) =>
    collectionEditorialMutations.reorderCollectionMedia(admin(), ordered),
  addBlock: (row: TablesInsert<"collection_blocks">) =>
    collectionEditorialMutations.insertCollectionBlock(admin(), row),
  removeBlock: (id: string) =>
    collectionEditorialMutations.deleteCollectionBlock(admin(), id),
  reorderBlocks: (ordered: { id: string; position: number }[]) =>
    collectionEditorialMutations.reorderCollectionBlocks(admin(), ordered),
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

export const adminFooter = {
  updateSettings: (
    row: TablesInsert<"footer_settings"> | TablesUpdate<"footer_settings">,
  ) => footerMutations.upsertFooterSettings(admin(), row),
  createSocialLink: (row: TablesInsert<"footer_social_links">) =>
    footerMutations.insertFooterSocialLink(admin(), row),
  updateSocialLink: (id: string, row: TablesUpdate<"footer_social_links">) =>
    footerMutations.updateFooterSocialLink(admin(), id, row),
  removeSocialLink: (id: string) => footerMutations.deleteFooterSocialLink(admin(), id),
  reorderSocialLinks: (ordered: { id: string; position: number }[]) =>
    footerMutations.reorderFooterSocialLinks(admin(), ordered),
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
  adminFooter,
  adminStorage,
};
