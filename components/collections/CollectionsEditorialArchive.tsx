import Link from "next/link";
import { CollectionArchiveCaption } from "@/components/collections/CollectionArchiveCaption";
import { CollectionArchiveMedia } from "@/components/collections/CollectionArchiveMedia";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/locale";
import type { EditorialCollection } from "@/lib/types/editorial-collection";
import { cn } from "@/lib/cn";

interface CollectionsEditorialArchiveProps {
  collections: EditorialCollection[];
  locale: Locale;
  /** Extra space above the first collection (e.g. after page intro). */
  leadSpacing?: string;
}

/**
 * Collections index — centered portrait column, title below each image.
 */
export function CollectionsEditorialArchive({
  collections,
  locale,
  leadSpacing,
}: CollectionsEditorialArchiveProps) {
  return (
    <ul
      className={cn(
        "mx-auto flex w-full max-w-[20rem] flex-col items-center gap-y-20 sm:max-w-[22rem] sm:gap-y-24 md:max-w-[24rem] md:gap-y-28",
        leadSpacing,
      )}
      aria-label="Collections"
    >
      {collections.map((collection, index) => {
        const href = localizedPath(locale, `/collections/${collection.slug}`);
        const name = collection.name;
        const subtitle = collection.subtitle?.trim();

        return (
          <li key={collection.id} className="w-full">
            <Link href={href} className="group block w-full outline-none">
              <div className="relative aspect-[4/5] w-full bg-[var(--maison-ivory)] p-5 sm:p-6 md:p-7">
                <div className="relative h-full w-full">
                  <CollectionArchiveMedia
                    collection={collection}
                    priority={index < 3}
                  />
                </div>
              </div>
              <CollectionArchiveCaption name={name} subtitle={subtitle} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
