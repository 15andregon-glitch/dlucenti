import type {
  CollectionBlockRow,
  CollectionMediaRow,
  CollectionRow,
} from "@/types/database";
import type {
  CollectionBlock,
  CollectionMediaItem,
  EditorialCollection,
} from "@/lib/types/editorial-collection";

function mapMedia(row: CollectionMediaRow): CollectionMediaItem {
  return {
    id: row.id,
    kind: row.kind,
    imageUrl: row.image_url,
    alt: row.alt ?? undefined,
    position: row.position,
  };
}

function mapBlock(row: CollectionBlockRow): CollectionBlock {
  return {
    id: row.id,
    blockType: row.block_type,
    position: row.position,
    content: (row.content as Record<string, unknown>) ?? {},
  };
}

export function mapEditorialCollection(
  row: CollectionRow,
  media: CollectionMediaRow[] = [],
  blocks: CollectionBlockRow[] = [],
): EditorialCollection {
  const sortedMedia = [...media].sort((a, b) => a.position - b.position);
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
  const heroDesktop =
    sortedMedia.find((m) => m.kind === "hero_desktop")?.image_url ?? row.cover_image;
  const editorialTitle = row.editorial_title || row.name;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortTitle: row.short_title || row.name,
    editorialTitle,
    subtitle: row.subtitle ?? "",
    description: row.description,
    launchDate: row.launch_date ?? undefined,
    publicationStatus: row.publication_status ?? "draft",
    coverImage: row.cover_image,
    featured: row.featured,
    hiddenFromFrontend: row.hidden_from_frontend ?? false,
    displayOrder: row.display_order ?? 0,
    campaignVideoUrl: row.campaign_video_url ?? undefined,
    storyBody: row.story_body ?? "",
    inspirationText: row.inspiration_text ?? "",
    materialsText: row.materials_text ?? "",
    campaignMood: row.campaign_mood ?? "",
    heroAlignment: row.hero_alignment ?? "center",
    textColor: row.text_color ?? "light",
    overlayOpacity: Number(row.overlay_opacity ?? 0.35),
    titlePosition: row.title_position ?? "center",
    enableFullscreenHero: row.enable_fullscreen_hero ?? true,
    enableDarkModeSection: row.enable_dark_mode_section ?? false,
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    ogImage: row.og_image || heroDesktop,
    media: sortedMedia.map(mapMedia),
    blocks: sortedBlocks.map(mapBlock),
    season: row.short_title || "",
    campaignImage: heroDesktop,
  };
}

export function getCollectionImage(
  collection: EditorialCollection,
  kind: CollectionMediaItem["kind"],
  fallback = "",
): string {
  return collection.media.find((m) => m.kind === kind)?.imageUrl || fallback;
}
