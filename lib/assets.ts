import { CAMPAIGN_GALLERY } from "@/lib/data/campaign-gallery";

/** Hero poster — same editorial frame as the campaign gallery (guaranteed in /public) */
const HERO_FALLBACK_IMAGE = CAMPAIGN_GALLERY.fullBleed.src;

/** Centralized public asset paths for campaigns, products, and editorial media. */
export const ASSETS = {
  images: {
    placeholder: HERO_FALLBACK_IMAGE,
    hero: HERO_FALLBACK_IMAGE,
  },
  videos: {
    hero: "/videos/hero.mp4",
  },
  products: (slug: string) => `/products/${slug}`,
  campaigns: (slug: string) => `/campaigns/${slug}`,
} as const;
