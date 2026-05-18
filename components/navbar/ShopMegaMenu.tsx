"use client";

import { useId } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  SHOP_MEGA_MENU,
  shopNavHref,
  type ShopAudience,
  type ShopNavItem,
} from "@/lib/shop-nav";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/cn";

function itemKey(audience: ShopAudience, item: ShopNavItem) {
  return `${audience}-${item.category ?? "all"}`;
}

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
          ? "text-[var(--maison-gray)]"
          : "text-[var(--maison-mist)]",
        className,
      )}
    >
      {label}
    </Link>
  );
}

function ShopMenuColumn({
  group,
  onNavigate,
}: {
  group: (typeof SHOP_MEGA_MENU)[number];
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-[6.5rem] text-center md:min-w-[7.5rem] md:text-left">
      <p className="mb-4 font-sans text-[0.9375rem] font-normal tracking-[var(--tracking-wide)] text-[var(--maison-charcoal)]">
        {group.label}
      </p>
      <ul className="flex flex-col items-center gap-3 md:items-start" role="list">
        {group.items.map((item) => (
          <li key={itemKey(group.audience, item)}>
            <MegaLink
              href={shopNavHref(group.audience, item.category)}
              label={item.label}
              onNavigate={onNavigate}
              emphasized={!item.category}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShopMenuColumns({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-12 sm:gap-x-16 lg:gap-x-20",
        className,
      )}
    >
      {SHOP_MEGA_MENU.map((group) => (
        <ShopMenuColumn key={group.audience} group={group} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

/* ─── Desktop mega panel ─── */

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
      aria-label="Shop categories"
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
      <div className="flex justify-center px-6 py-8 md:px-12 md:py-9 lg:py-10">
        <ShopMenuColumns onNavigate={onNavigate} />
      </div>
    </div>
  );
}

/* ─── Desktop trigger ─── */

export function ShopNavTrigger({
  open,
  panelId,
  active,
}: {
  open: boolean;
  panelId: string;
  active?: boolean;
}) {
  return (
    <Link
      href={ROUTES.shop}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={panelId}
      className={cn(
        "navbar-nav-link group relative",
        active && "navbar-nav-link--active",
      )}
    >
      Shop
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

/* ─── Mobile accordion ─── */

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
          Shop
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
          <div className="flex justify-center pb-8 pt-3">
            <ShopMenuColumns onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </li>
  );
}
