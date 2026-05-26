import type { Tables } from "./schema";

export type CollectionRow = Tables<"collections">;
export type CollectionMediaRow = Tables<"collection_media">;
export type CollectionBlockRow = Tables<"collection_blocks">;
export type ProductRow = Tables<"products">;
export type ProductImageRow = Tables<"product_images">;
export type ProductVariantRow = Tables<"product_variants">;
export type HomepageSettingsRow = Tables<"homepage_settings">;
export type HomepageNewInRow = Tables<"homepage_new_in">;
export type CampaignRow = Tables<"campaigns">;
export type FooterSettingsRow = Tables<"footer_settings">;
export type FooterSocialLinkRow = Tables<"footer_social_links">;
export type AdminRow = Tables<"admins">;
export type ReportingPeriodRow = Tables<"reporting_periods">;
export type FinancialCategoryRow = Tables<"financial_categories">;
export type FinancialEntryRow = Tables<"financial_entries">;
export type DRSnapshotRow = Tables<"dr_snapshots">;
export type OrderRow = Tables<"orders">;
export type OrderItemRow = Tables<"order_items">;

export type ProductWithImages = ProductRow & {
  product_images: ProductImageRow[];
};

export type ProductWithCollection = ProductWithImages & {
  collections: CollectionRow | null;
};

/** Raw homepage payload before mapping to domain types */
export type HomepageContentRaw = {
  settings: HomepageSettingsRow | null;
  newIn: ProductWithImages[];
  campaigns: CampaignRow[];
  featuredCollection: CollectionRow | null;
};
