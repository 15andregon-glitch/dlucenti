/** Editorial campaign gallery — local assets from /public/products */
export interface CampaignFrame {
  id: string;
  src: string;
  alt: string;
}

export const CAMPAIGN_GALLERY = {
  fullBleed: {
    id: "full-bleed",
    src: "/products/necklace-1.jpg",
    alt: "Lumière campaign — full frame",
  },
  portraitLeft: {
    id: "portrait-left",
    src: "/products/earrings-1.jpg",
    alt: "Arc study — portrait",
  },
  landscapeRight: {
    id: "landscape-right",
    src: "/products/necklace-2.jpg",
    alt: "Noir campaign — landscape",
  },
  accentPortrait: {
    id: "accent-portrait",
    src: "/products/necklace-2.jpg",
    alt: "Woven light — detail",
  },
  tallFeature: {
    id: "tall-feature",
    src: "/products/necklace-1.jpg",
    alt: "Maison Aurélie — editorial",
  },
  closingWide: {
    id: "closing-wide",
    src: "/products/earrings-1.jpg",
    alt: "SS26 — closing frame",
  },
} as const satisfies Record<string, CampaignFrame>;
