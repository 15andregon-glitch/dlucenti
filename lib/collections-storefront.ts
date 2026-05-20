import type {
  CollectionMediaItem,
  EditorialCollection,
} from "@/lib/types/editorial-collection";

/** True when URL points at video, not a still image (editorial archive must stay static). */
export function isVideoAssetUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return false;
  const path = url.split("?")[0]!.split("#")[0]!.toLowerCase();
  return /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(path);
}

/** Published collections for storefront — newest launch first. */
export function sortCollectionsForStorefront(
  collections: EditorialCollection[],
): EditorialCollection[] {
  return [...collections]
    .filter((c) => c.publicationStatus === "published" && !c.hiddenFromFrontend)
    .sort((a, b) => {
      const dateA = a.launchDate ? Date.parse(a.launchDate) : 0;
      const dateB = b.launchDate ? Date.parse(b.launchDate) : 0;
      if (dateB !== dateA) return dateB - dateA;
      return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
    });
}

/** Nav / general poster — may include hero imagery. */
export function getCollectionPosterUrl(collection: EditorialCollection): string {
  const fromMedia =
    collection.media.find((m) => m.kind === "atmosphere")?.imageUrl ||
    collection.media.find((m) => m.kind === "editorial_cover")?.imageUrl ||
    collection.media.find((m) => m.kind === "hero_desktop")?.imageUrl ||
    collection.media.find((m) => m.kind === "hero_mobile")?.imageUrl;

  return fromMedia || collection.coverImage || collection.campaignImage || "";
}

const ARCHIVE_STILL_KINDS: CollectionMediaItem["kind"][] = [
  "thumbnail",
  "editorial_cover",
  "atmosphere",
  "editorial_gallery",
  "hero_desktop",
  "hero_mobile",
  "og_image",
];

/**
 * Archive index only — still images; never campaign video or .mp4/.webm URLs.
 */
export function getCollectionArchivePosterUrl(
  collection: EditorialCollection,
): string {
  for (const kind of ARCHIVE_STILL_KINDS) {
    const url = collection.media.find((m) => m.kind === kind)?.imageUrl;
    if (url && !isVideoAssetUrl(url)) return url;
  }

  const fallbacks = [
    collection.coverImage,
    collection.campaignImage,
    collection.ogImage,
  ];
  for (const url of fallbacks) {
    if (url && !isVideoAssetUrl(url)) return url;
  }

  return "";
}
