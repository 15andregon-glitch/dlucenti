import { PageContainer } from "@/components/layout/PageContainer";
import type { EditorialCollection } from "@/lib/types/editorial-collection";
import { cn } from "@/lib/cn";

interface CollectionEditorialStoryProps {
  collection: EditorialCollection;
}

export function CollectionEditorialStory({ collection }: CollectionEditorialStoryProps) {
  const hasContent =
    collection.storyBody ||
    collection.inspirationText ||
    collection.materialsText ||
    collection.campaignMood;

  if (!hasContent) return null;

  const dark = collection.enableDarkModeSection;

  return (
    <section
      className={cn(
        "py-10 md:py-12",
        dark ? "bg-[var(--maison-charcoal)] text-[var(--hero-text-ivory)]" : "bg-[var(--maison-warm-white)]",
      )}
    >
      <PageContainer>
        <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-12 md:gap-16">
          {collection.storyBody && (
            <div className="md:col-span-7">
              <p className="text-maison-label">Narrative</p>
              <p
                className={cn(
                  "mt-6 text-maison-headline text-2xl leading-snug md:text-3xl",
                  dark ? "text-[var(--hero-text-ivory)]" : "text-[var(--maison-charcoal)]",
                )}
              >
                {collection.storyBody}
              </p>
            </div>
          )}
          <div className="space-y-10 md:col-span-5 md:pt-2">
            {collection.inspirationText && (
              <div>
                <p className="text-maison-label">Inspiration</p>
                <p className="mt-3 text-maison-body-sm">{collection.inspirationText}</p>
              </div>
            )}
            {collection.materialsText && (
              <div>
                <p className="text-maison-label">Materials</p>
                <p className="mt-3 text-maison-body-sm">{collection.materialsText}</p>
              </div>
            )}
            {collection.campaignMood && (
              <div>
                <p className="text-maison-label">Mood</p>
                <p className="mt-3 text-maison-body-sm">{collection.campaignMood}</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
