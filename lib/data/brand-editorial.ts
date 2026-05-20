import { ASSETS } from "@/lib/assets";
import { CAMPAIGN_GALLERY } from "@/lib/data/campaign-gallery";
import type { EditorialVideoMedia } from "@/lib/types/editorial-media";

/**
 * Default brand editorial video — swap via CMS `EditorialVideoMedia` when wired.
 * Place your file at `public/videos/lucenti-editorial.mp4`.
 */
export const BRAND_EDITORIAL_VIDEO: EditorialVideoMedia = {
  src: ASSETS.videos.lucentiEditorial,
  posterSrc: CAMPAIGN_GALLERY.tallFeature.src,
  posterAlt: CAMPAIGN_GALLERY.tallFeature.alt,
  mimeType: "video/mp4",
};
