import type { Tables } from "./schema";

export type CollectionRow = Tables<"collections">;
export type ProductRow = Tables<"products">;
export type ProductImageRow = Tables<"product_images">;
export type HomepageSettingsRow = Tables<"homepage_settings">;
export type HomepageNewInRow = Tables<"homepage_new_in">;
export type CampaignRow = Tables<"campaigns">;
export type AdminRow = Tables<"admins">;

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
