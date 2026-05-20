import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { getCollectionImage } from "@/lib/supabase/collection-mapper";
import type { CollectionBlock, EditorialCollection } from "@/lib/types/editorial-collection";
import { cn } from "@/lib/cn";

function BlockRenderer({ block }: { block: CollectionBlock }) {
  const c = block.content;

  switch (block.blockType) {
    case "quote":
      return (
        <blockquote className="mx-auto max-w-3xl py-[var(--section-py)] text-center">
          <p className="text-maison-headline text-3xl leading-snug md:text-4xl">
            {String(c.text ?? "")}
          </p>
          {c.attribution ? (
            <footer className="mt-6 text-maison-label">{String(c.attribution)}</footer>
          ) : null}
        </blockquote>
      );
    case "cinematic_image": {
      const url = String(c.imageUrl ?? "");
      if (!url) return null;
      const layout = String(c.layout ?? "full");
      return (
        <figure
          className={cn(
            "py-12 md:py-16",
            layout === "portrait-left" && "md:grid md:grid-cols-12 md:gap-10",
            layout === "portrait-right" && "md:grid md:grid-cols-12 md:gap-10",
          )}
        >
          <div
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden md:aspect-[4/5]",
              layout === "portrait-left" && "md:col-span-5",
              layout === "portrait-right" && "md:col-span-5 md:col-start-8",
              layout === "full" && "aspect-[16/10] md:aspect-[21/9]",
            )}
          >
            <Image src={url} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          {c.caption ? (
            <figcaption className="mt-4 text-maison-label md:col-span-12">
              {String(c.caption)}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "spacer":
      return <div className="h-16 md:h-24" aria-hidden />;
    case "story":
      return (
        <PageContainer className="py-16 md:py-20">
          <p className="mx-auto max-w-2xl text-maison-body-sm leading-relaxed">
            {String(c.body ?? "")}
          </p>
        </PageContainer>
      );
    default:
      return null;
  }
}

interface CollectionEditorialBlocksProps {
  collection: EditorialCollection;
}

export function CollectionEditorialGallery({ collection }: CollectionEditorialBlocksProps) {
  const gallery = collection.media.filter((m) => m.kind === "editorial_gallery");
  const atmosphere = collection.media.filter((m) => m.kind === "atmosphere");

  if (!gallery.length && !atmosphere.length) return null;

  const images = [...gallery, ...atmosphere];

  return (
    <section className="bg-[var(--maison-beige)] py-10 md:py-12">
      <PageContainer>
        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={cn(
                "relative overflow-hidden",
                i % 3 === 0
                  ? "aspect-[3/4] md:col-span-5"
                  : i % 3 === 1
                    ? "aspect-[4/5] md:col-span-7 md:mt-16"
                    : "aspect-[3/4] md:col-span-6 md:col-start-4",
              )}
            >
              <Image
                src={img.imageUrl}
                alt={img.alt ?? collection.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

export function CollectionEditorialBlocks({ collection }: CollectionEditorialBlocksProps) {
  return (
    <>
      <CollectionEditorialGallery collection={collection} />
      {collection.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}

export function CollectionCampaignVideo({ collection }: CollectionEditorialBlocksProps) {
  if (!collection.campaignVideoUrl) return null;

  return (
    <section className="bg-[var(--maison-charcoal)] py-20 md:py-28">
      <PageContainer>
        <div className="relative aspect-video w-full overflow-hidden">
          <video
            src={collection.campaignVideoUrl}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </PageContainer>
    </section>
  );
}

export function CollectionEditorialCover({
  collection,
}: CollectionEditorialBlocksProps) {
  const cover =
    getCollectionImage(collection, "editorial_cover", "") || collection.coverImage;
  if (!cover) return null;

  return (
    <section className="py-12 md:py-16">
      <PageContainer>
        <div className="relative mx-auto aspect-[16/10] max-w-5xl overflow-hidden md:aspect-[21/9]">
          <Image src={cover} alt="" fill className="object-cover" sizes="90vw" priority={false} />
        </div>
      </PageContainer>
    </section>
  );
}
