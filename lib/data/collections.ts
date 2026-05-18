import type { Collection } from "@/lib/types";

export const collections: Collection[] = [
  {
    id: "1",
    slug: "lumiere",
    name: "Lumière",
    season: "SS26",
    description: "Light refracted through gold — an ode to Parisian dawn.",
    coverImage: "/campaigns/lumiere-cover.jpg",
    campaignImage: "/campaigns/lumiere-hero.jpg",
    featured: true,
  },
  {
    id: "2",
    slug: "noir",
    name: "Noir",
    season: "FW25",
    description: "Sculpted darkness. Givenchy restraint in every facet.",
    coverImage: "/campaigns/noir-cover.jpg",
    featured: true,
  },
  {
    id: "3",
    slug: "arc",
    name: "Arc",
    season: "SS25",
    description: "Geometry as ornament — minimal lines, maximum presence.",
    coverImage: "/campaigns/arc-cover.jpg",
    featured: true,
  },
];
