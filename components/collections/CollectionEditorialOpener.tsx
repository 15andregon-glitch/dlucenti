import { CollectionHeroMedia } from "@/components/collections/CollectionHeroMedia";
import { PageContainer } from "@/components/layout/PageContainer";
import type { EditorialCollection } from "@/lib/types/editorial-collection";

interface CollectionEditorialOpenerProps {
  collection: EditorialCollection;
  priority?: boolean;
}

/**
 * Quiet collection entry — portrait media only, no visible titles.
 * Replaces fullscreen CollectionEditorialHero on detail pages.
 */
export function CollectionEditorialOpener({
  collection,
  priority = false,
}: CollectionEditorialOpenerProps) {
  const title = collection.editorialTitle || collection.name;

  return (
    <section className="bg-[var(--maison-warm-white)] pt-[calc(4.25rem+2.5rem)] md:pt-[calc(4.75rem+3rem)]">
      <PageContainer className="pb-10 md:pb-14">
        <h1 className="sr-only">{title}</h1>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[22rem] overflow-hidden sm:max-w-[24rem] md:max-w-[26rem]">
          <CollectionHeroMedia collection={collection} priority={priority} />
        </div>
      </PageContainer>
    </section>
  );
}
