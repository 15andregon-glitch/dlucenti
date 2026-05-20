export type CollectionPublicationStatus = "draft" | "published";
export type CollectionHeroAlignment = "left" | "center" | "right";
export type CollectionTextColor = "light" | "dark";
export type CollectionTitlePosition = "top" | "center" | "bottom";

export type CollectionMediaKind =
  | "hero_desktop"
  | "hero_mobile"
  | "editorial_cover"
  | "thumbnail"
  | "atmosphere"
  | "editorial_gallery"
  | "og_image";

export type CollectionBlockType =
  | "story"
  | "quote"
  | "cinematic_image"
  | "gallery"
  | "spacer";

export interface CollectionMediaItem {
  id: string;
  kind: CollectionMediaKind;
  imageUrl: string;
  alt?: string;
  position: number;
}

export interface CollectionBlock {
  id: string;
  blockType: CollectionBlockType;
  position: number;
  content: Record<string, unknown>;
}

export interface EditorialCollection {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  editorialTitle: string;
  subtitle: string;
  description: string;
  launchDate?: string;
  publicationStatus: CollectionPublicationStatus;
  coverImage: string;
  featured: boolean;
  hiddenFromFrontend: boolean;
  displayOrder: number;
  campaignVideoUrl?: string;
  storyBody: string;
  inspirationText: string;
  materialsText: string;
  campaignMood: string;
  heroAlignment: CollectionHeroAlignment;
  textColor: CollectionTextColor;
  overlayOpacity: number;
  titlePosition: CollectionTitlePosition;
  enableFullscreenHero: boolean;
  enableDarkModeSection: boolean;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  media: CollectionMediaItem[];
  blocks: CollectionBlock[];
  /** @deprecated use shortTitle or editorialTitle */
  season: string;
  campaignImage?: string;
}
