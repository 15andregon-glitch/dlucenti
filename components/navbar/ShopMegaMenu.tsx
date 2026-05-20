"use client";

import { useId } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  getShopNavCategories,
  getShopNavItems,
  shopMenuLabel,
  shopNavHref,
  shopNavPieceHref,
  shopPieceMenuLabel,
  type ShopNavItem,
} from "@/lib/shop-nav";
import type { ShopNavCategory } from "@/lib/shop-catalog";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

function MegaLink({
  href,
  label,
  onNavigate,
  emphasized,
  className,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
  emphasized?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "inline-flex w-fit font-sans text-[var(--maison-chrome-size)] font-normal tracking-[var(--tracking-normal)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-55 motion-reduce:transition-none",
        emphasized
          ? "text-[var(--maison-charcoal)]"
          : "text-[var(--maison-mist)]",
        className,
      )}
    >
      {label}
    </Link>
  );
}

function ShopAudienceColumn({
  audience,
  onNavigate,
  className,
}: {
  audience: ShopNavItem;
  onNavigate?: () => void;
  className?: string;
}) {
  const { messages, locale } = useTranslations();
  const categories = getShopNavCategories();

  return (
    <nav
      aria-label={shopMenuLabel(messages, audience.key)}
      className={cn("flex flex-col", className)}
    >
      <MegaLink
        href={shopNavHref(locale, audience.segment)}
        label={shopMenuLabel(messages, audience.key)}
        onNavigate={onNavigate}
        emphasized
      />
      {audience.segment !== "all" ? (
        <ul className="mt-4 flex flex-col gap-2.5 md:mt-5 md:gap-3" role="list">
          {categories.map((category: ShopNavCategory) => (
            <li key={`${audience.segment}-${category}`}>
              <MegaLink
                href={shopNavPieceHref(locale, audience.segment, category)}
                label={shopPieceMenuLabel(messages, category)}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}

function ShopMenuColumns({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const items = getShopNavItems();

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-12 sm:gap-14",
        "md:flex-row md:items-start md:justify-center md:gap-16 lg:gap-20 xl:gap-24",
        className,
      )}
    >
      {items.map((item) => (
        <ShopAudienceColumn key={item.segment} audience={item} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export function ShopMegaMenuDesktop({
  open,
  panelId,
  onNavigate,
}: {
  open: boolean;
  panelId: string;
  onNavigate?: () => void;
}) {
  return (
    <div
      id={panelId}
      role="region"
      aria-label="Shop"
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
      <div className="flex justify-center px-6 py-9 md:px-12 md:py-10 lg:py-11">
        <ShopMenuColumns onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function ShopNavTrigger({
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
      href={routes.shopAll}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={panelId}
      className={cn(
        "navbar-nav-link group relative",
        active && "navbar-nav-link--active",
      )}
    >
      {t("nav.shop")}
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

export function ShopMobileAccordion({
  expanded,
  onToggle,
  onNavigate,
  index,
}: {
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
        className="flex w-full items-baseline justify-between py-6 text-left"
      >
        <span className="font-serif text-[clamp(1.75rem,7vw,2.25rem)] font-normal leading-none tracking-tight text-[var(--maison-charcoal)]">
          {t("nav.shop")}
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
          <div className="flex justify-center pb-8 pt-2">
            <ShopMenuColumns
              onNavigate={onNavigate}
              className="items-start gap-10 px-2 sm:gap-12"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
