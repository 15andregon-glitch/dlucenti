"use client";

import Image from "next/image";
import { EditorialCinematicVideo } from "@/components/media/EditorialCinematicVideo";
import { getCollectionPosterUrl } from "@/lib/collections-storefront";
import { getCollectionImage } from "@/lib/supabase/collection-mapper";
import type { EditorialCollection } from "@/lib/types/editorial-collection";

interface CollectionHeroMediaProps {
  collection: EditorialCollection;
  priority?: boolean;
}

export function CollectionHeroMedia({
  collection,
  priority = false,
}: CollectionHeroMediaProps) {
  const poster = getCollectionPosterUrl(collection);
  const desktop =
    getCollectionImage(collection, "hero_desktop", poster) || collection.coverImage;
  const mobile =
    getCollectionImage(collection, "hero_mobile", desktop) || desktop;
  const title = collection.editorialTitle || collection.name;

  if (collection.campaignVideoUrl) {
    return (
      <EditorialCinematicVideo
        media={{
          src: collection.campaignVideoUrl,
          posterSrc: poster || desktop,
          posterAlt: title,
        }}
        className="absolute inset-0"
        toneClassName="from-transparent via-transparent to-[rgba(42,40,36,0.18)]"
      />
    );
  }

  return (
    <>
      <Image
        src={desktop}
        alt={title}
        fill
        priority={priority}
        className="hidden object-cover object-center md:block"
        sizes="100vw"
      />
      <Image
        src={mobile}
        alt={title}
        fill
        priority={priority}
        className="object-cover object-center md:hidden"
        sizes="100vw"
      />
    </>
  );
}
