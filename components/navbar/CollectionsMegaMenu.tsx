"use client";

import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCollectionArchivePosterUrl } from "@/lib/collections-storefront";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/locale";
import type { EditorialCollection } from "@/lib/types/editorial-collection";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

function CollectionNavPreview({
  collection,
  locale,
  onNavigate,
}: {
  collection: EditorialCollection;
  locale: Locale;
  onNavigate?: () => void;
}) {
  const poster = getCollectionArchivePosterUrl(collection);
  const href = localizedPath(locale, `/collections/${collection.slug}`);
  const title = collection.editorialTitle || collection.name;
  const videoSrc = collection.campaignVideoUrl?.trim();

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex w-[7.25rem] shrink-0 flex-col sm:w-[8rem] md:w-[8.75rem]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--maison-champagne)]">
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-[0.94] transition-opacity duration-700 ease-[var(--ease-maison)] group-hover:opacity-100"
            aria-hidden
          />
        ) : poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover object-center transition-opacity duration-700 ease-[var(--ease-maison)] group-hover:opacity-90"
            sizes="140px"
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(42,40,36,0.45)] via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <p className="mt-3 font-sans text-[var(--maison-chrome-size)] text-[var(--maison-charcoal)]">
        {collection.shortTitle || collection.name}
      </p>
      <p className="mt-0.5 line-clamp-2 font-sans text-[0.75rem] leading-snug text-[var(--maison-mist)]">
        {title}
      </p>
    </Link>
  );
}

function CollectionsMenuPanel({
  collections,
  locale,
  onNavigate,
  className,
}: {
  collections: EditorialCollection[];
  locale: Locale;
  onNavigate?: () => void;
  className?: string;
}) {
  const { t, routes } = useTranslations();

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="-mx-1 flex gap-6 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:justify-center md:gap-8 md:overflow-visible md:pb-0">
        {collections.map((collection) => (
          <CollectionNavPreview
            key={collection.id}
            collection={collection}
            locale={locale}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <div className="flex justify-center md:justify-start">
        <Link
          href={routes.collections}
          onClick={onNavigate}
          className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-mist)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55"
        >
          {t("collections.viewAll")}
        </Link>
      </div>
    </div>
  );
}

export function CollectionsMegaMenuDesktop({
  collections,
  locale,
  open,
  panelId,
  onNavigate,
}: {
  collections: EditorialCollection[];
  locale: Locale;
  open: boolean;
  panelId: string;
  onNavigate?: () => void;
}) {
  return (
    <div
      id={panelId}
      role="region"
      aria-label="Collections"
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-full hidden border-t border-[var(--maison-hairline)] md:block",
        "bg-[rgba(251,249,246,0.98)] backdrop-blur-[2px]",
        "transition-[opacity,transform] duration-500 ease-[var(--ease-maison)]",
        "motion-reduce:transition-none",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <div className="px-6 py-9 md:px-12 md:py-10 lg:py-11">
        <CollectionsMenuPanel
          collections={collections}
          locale={locale}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

export function CollectionsNavTrigger({
  open,
  panelId,
  active,
}: {
  open: boolean;
  panelId: string;
  active?: boolean;
}) {
  const { t, routes } = useTranslations();

  return (
    <Link
      href={routes.collections}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={panelId}
      className={cn(
        "navbar-nav-link group relative",
        active && "navbar-nav-link--active",
      )}
    >
      {t("nav.collections")}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-px left-0 h-px bg-[var(--maison-gold)] transition-[width] duration-400 ease-out",
          open ? "w-full" : "w-0 group-hover:w-full",
        )}
      />
    </Link>
  );
}

export function CollectionsMobileAccordion({
  collections,
  locale,
  expanded,
  onToggle,
  onNavigate,
  index,
}: {
  collections: EditorialCollection[];
  locale: Locale;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  index: number;
}) {
  const panelId = useId();
  const { t } = useTranslations();

  return (
    <li className="border-b border-[var(--maison-hairline)]">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="mobile-menu-item flex w-full items-baseline justify-between text-left"
      >
        <span className="font-sans text-[clamp(1.75rem,7vw,2.25rem)] font-normal leading-none tracking-tight text-[var(--maison-charcoal)]">
          {t("nav.collections")}
        </span>
        <span className="flex items-center gap-4">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--maison-mist)] transition-transform duration-500 ease-[var(--ease-maison)]",
              expanded && "rotate-180",
            )}
            strokeWidth={1.25}
            aria-hidden
          />
          <span className="font-sans text-xs tabular-nums text-[var(--maison-mist)]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
      </button>

      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-maison)] motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pt-1">
            <CollectionsMenuPanel
              collections={collections}
              locale={locale}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
