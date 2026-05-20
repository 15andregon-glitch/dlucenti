import Image from "next/image";
import {
  getCollectionArchivePosterUrl,
  isVideoAssetUrl,
} from "@/lib/collections-storefront";
import type { EditorialCollection } from "@/lib/types/editorial-collection";
import { cn } from "@/lib/cn";

interface CollectionArchiveMediaProps {
  collection: EditorialCollection;
  priority?: boolean;
  className?: string;
  /** When true, alt text is omitted (parent link provides aria-label). */
  decorative?: boolean;
}

/** Print-like archive — no movement; optional subtle brightness on hover only. */
const archiveHover =
  "transition-[filter] duration-700 ease-[var(--ease-maison)] group-hover:brightness-[0.98]";

export function CollectionArchiveMedia({
  collection,
  priority = false,
  className,
  decorative = false,
}: CollectionArchiveMediaProps) {
  const poster = getCollectionArchivePosterUrl(collection);
  const title = collection.editorialTitle || collection.name;
  const alt = decorative ? "" : title;

  // Never render video in editorial archive (including .mp4 used as image_url).
  const stillUrl =
    poster && !isVideoAssetUrl(poster) ? poster : "";

  if (!stillUrl) {
    return (
      <div
        className={cn(
          "h-full w-full bg-[var(--maison-champagne)]",
          archiveHover,
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={stillUrl}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 640px) 88vw, 320px"
      className={cn("object-contain object-center", archiveHover, className)}
    />
  );
}
