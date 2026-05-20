import Link from "next/link";
import { CollectionHeroMedia } from "@/components/collections/CollectionHeroMedia";
import type { EditorialCollection } from "@/lib/types/editorial-collection";
import { cn } from "@/lib/cn";

interface CollectionEditorialHeroProps {
  collection: EditorialCollection;
  href?: string;
  viewCollectionLabel?: string;
  priority?: boolean;
  className?: string;
}

const alignClass: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const positionClass: Record<string, string> = {
  top: "justify-start pt-28 md:pt-36",
  center: "justify-center",
  bottom: "justify-end pb-20 md:pb-28",
};

export function CollectionEditorialHero({
  collection,
  href,
  viewCollectionLabel = "View collection",
  priority = false,
  className,
}: CollectionEditorialHeroProps) {
  const isLight = collection.textColor === "light";
  const height = collection.enableFullscreenHero ? "min-h-[100dvh]" : "min-h-[92vh]";

  const inner = (
    <section
      className={cn(
        "relative flex w-full overflow-hidden",
        height,
        positionClass[collection.titlePosition],
        className,
      )}
    >
      <div className="absolute inset-0">
        <CollectionHeroMedia collection={collection} priority={priority} />
        <div
          className="absolute inset-0 bg-[var(--maison-charcoal)]"
          style={{ opacity: collection.overlayOpacity }}
          aria-hidden
        />
      </div>

      <div
        className={cn(
          "relative z-10 flex w-full flex-col px-[var(--section-px)]",
          alignClass[collection.heroAlignment],
        )}
      >
        {collection.shortTitle ? (
          <p
            className={cn(
              "text-maison-label",
              isLight ? "text-[var(--hero-text-champagne)]" : "text-[var(--maison-mist)]",
            )}
          >
            {collection.shortTitle}
          </p>
        ) : null}
        <h1
          className={cn(
            "mt-4 max-w-4xl text-maison-display text-[clamp(2.25rem,6.5vw,4.25rem)] leading-[1.06]",
            isLight ? "text-[var(--hero-text-ivory)]" : "text-[var(--maison-charcoal)]",
          )}
        >
          {collection.editorialTitle || collection.name}
        </h1>
        {collection.subtitle ? (
          <p
            className={cn(
              "mt-5 max-w-md text-maison-body-sm leading-[1.65] md:mt-6",
              isLight ? "text-[var(--hero-text-champagne)]/90" : "text-[var(--maison-gray)]",
            )}
          >
            {collection.subtitle}
          </p>
        ) : null}
        {href ? (
          <span
            className={cn(
              "mt-10 inline-block border-b pb-0.5 font-sans text-[0.8125rem] tracking-[0.06em]",
              isLight
                ? "border-[var(--hero-text-champagne)]/45 text-[var(--hero-text-ivory)]"
                : "border-[var(--maison-charcoal)]/25 text-[var(--maison-charcoal)]",
            )}
          >
            {viewCollectionLabel}
          </span>
        ) : null}
      </div>
    </section>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}
