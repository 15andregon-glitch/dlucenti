"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/routes";
import {
  ShopMegaMenuDesktop,
  ShopMobileAccordion,
  ShopNavTrigger,
} from "@/components/navbar/ShopMegaMenu";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart";

/** Shared elevated surface — scroll & hover use identical values */
const NAVBAR_SURFACE =
  "border-[var(--maison-hairline)] bg-[rgba(251,249,246,0.92)]";
const NAVBAR_IDLE = "border-transparent bg-transparent";

function NavLink({
  href,
  label,
  onClick,
  onMouseEnter,
  className = "",
}: {
  href: string;
  label: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn("navbar-nav-link group relative", className)}
    >
      {label}
      <span
        aria-hidden
        className="absolute -bottom-px left-0 h-px w-0 bg-[var(--maison-gold)] transition-[width] duration-400 ease-out group-hover:w-full"
      />
    </Link>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="navbar-icon-btn flex h-10 w-10 items-center justify-center"
    >
      {children}
    </button>
  );
}

function CartBagButton() {
  const [mounted, setMounted] = useState(false);
  const setOpen = useCartStore((s) => s.setOpen);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => setMounted(true), []);

  const count = mounted ? totalItems() : 0;

  return (
    <IconButton label="Shopping bag" onClick={() => setOpen(true)}>
      <span className="relative">
        <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.25} />
        {count > 0 && (
          <span className="absolute -right-2 -top-1.5 min-w-[0.875rem] text-center font-sans text-[0.625rem] tabular-nums leading-none text-[var(--navbar-icon-color)]">
            {count}
          </span>
        )}
      </span>
    </IconButton>
  );
}

export default function Navbar() {
  const shopPanelId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopExpanded, setShopExpanded] = useState(false);

  const elevated = scrolled || hovered || menuOpen || shopOpen;
  const overHero = !elevated;

  const closeMobile = () => {
    setMenuOpen(false);
    setShopExpanded(false);
  };

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 32);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      setShopOpen(false);
      if (mq.matches) {
        setMenuOpen(false);
        setShopExpanded(false);
      }
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setShopOpen(false);
        }}
        data-over-hero={overHero ? "" : undefined}
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 border-b",
          "transition-[background-color,border-color] duration-500 ease-[var(--ease-maison)]",
          elevated ? NAVBAR_SURFACE : NAVBAR_IDLE,
        )}
      >
        <nav
          aria-label="Main"
          className="relative mx-auto grid h-[4.25rem] max-w-[1440px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 px-6 md:h-[4.75rem] md:gap-x-6 md:px-12 lg:px-16"
        >
          <div className="relative z-10 flex min-w-0 items-center justify-self-start">
            <Link
              href="/"
              className="navbar-brand-link truncate"
              onClick={closeMobile}
            >
              Maison Aurélie
            </Link>
          </div>

          <ul className="hidden shrink-0 items-center justify-center gap-8 whitespace-nowrap md:flex lg:gap-14 xl:gap-[5.5rem]">
            {NAV_LINKS.map((link) =>
              link.label === "Shop" ? (
                <li
                  key={link.href}
                  onMouseEnter={() => setShopOpen(true)}
                >
                  <ShopNavTrigger
                    open={shopOpen}
                    panelId={shopPanelId}
                    active={shopOpen && !overHero}
                  />
                </li>
              ) : (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    onMouseEnter={() => setShopOpen(false)}
                  />
                </li>
              ),
            )}
          </ul>

          <div className="relative z-10 flex items-center justify-self-end gap-1">
            <div
              className={cn(
                "flex shrink-0 items-center gap-1 transition-opacity duration-300",
                menuOpen &&
                  "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100",
              )}
            >
              <IconButton label="Search">
                <Search className="h-[17px] w-[17px]" strokeWidth={1.25} />
              </IconButton>
              <CartBagButton />
            </div>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen((o) => {
                  if (o) setShopExpanded(false);
                  return !o;
                })
              }
              className="navbar-icon-btn flex h-10 w-10 items-center justify-center md:hidden"
            >
              {menuOpen ? (
                <X className="h-[18px] w-[18px]" strokeWidth={1.25} />
              ) : (
                <Menu className="h-[18px] w-[18px]" strokeWidth={1.25} />
              )}
            </button>
          </div>
        </nav>

        <ShopMegaMenuDesktop
          open={shopOpen}
          panelId={shopPanelId}
          onNavigate={() => setShopOpen(false)}
        />
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[var(--maison-warm-white)] transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col px-6 pt-28 pb-12 md:px-12">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) =>
              link.label === "Shop" ? (
                <ShopMobileAccordion
                  key={link.href}
                  expanded={shopExpanded}
                  onToggle={() => setShopExpanded((o) => !o)}
                  onNavigate={closeMobile}
                  index={i}
                />
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className="flex items-baseline justify-between border-b border-[var(--maison-hairline)] py-6 transition-colors hover:text-[var(--maison-gold)]"
                  >
                    <span className="font-serif text-[clamp(1.75rem,7vw,2.25rem)] font-normal leading-none tracking-tight text-[var(--maison-charcoal)]">
                      {link.label}
                    </span>
                    <span className="font-sans text-xs tabular-nums text-[var(--maison-mist)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-[var(--maison-hairline)] pt-8">
            <div className="flex gap-6">
              <button type="button" className="text-maison-nav">
                Search
              </button>
              <button type="button" className="text-maison-nav">
                Cart
              </button>
            </div>
            <p className="text-maison-label">Paris · Since 1892</p>
          </div>
        </div>
      </div>
    </>
  );
}
