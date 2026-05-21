import type { Locale } from "@/lib/i18n/locale";
import { localizedPath } from "@/lib/i18n/paths";
import type { ShopNavCategory } from "@/lib/shop-catalog";
import type { ShopAudienceSegment } from "@/lib/shop-audience";

/** Build locale-aware storefront routes */
export function getRoutes(locale: Locale) {
  return {
    home: localizedPath(locale, "/"),
    shop: localizedPath(locale, "/shop/all"),
    shopWomen: localizedPath(locale, "/shop/women"),
    shopMen: localizedPath(locale, "/shop/men"),
    shopAll: localizedPath(locale, "/shop/all"),
    shopCategory: (audience: ShopAudienceSegment, category: ShopNavCategory) =>
      localizedPath(locale, `/shop/${audience}/${category}`),
    collections: localizedPath(locale, "/collections"),
    collection: (slug: string) => localizedPath(locale, `/collections/${slug}`),
    product: (slug: string) => localizedPath(locale, `/shop/${slug}`),
    about: localizedPath(locale, "/about"),
    journal: localizedPath(locale, "/journal"),
    journalPost: (slug: string) => localizedPath(locale, `/journal/${slug}`),
    contact: localizedPath(locale, "/contact"),
    checkout: localizedPath(locale, "/checkout"),
    checkoutSuccess: localizedPath(locale, "/checkout/success"),
    checkoutCancel: localizedPath(locale, "/checkout/cancel"),
    /** Admin / legacy — never locale-prefixed */
    dashboard: "/dashboard",
    dashboardProducts: "/dashboard/products",
    dashboardOrders: "/dashboard/orders",
    dashboardCampaigns: "/dashboard/campaigns",
  } as const;
}

export type StorefrontRoutes = ReturnType<typeof getRoutes>;

export type NavLinkKey = "shop" | "collections" | "about";

export interface NavLinkItem {
  key: NavLinkKey;
  href: string;
}

export function getNavLinks(locale: Locale): NavLinkItem[] {
  const routes = getRoutes(locale);
  return [
    { key: "shop", href: routes.shop },
    { key: "collections", href: routes.collections },
    { key: "about", href: routes.about },
  ];
}

/** @deprecated Use getRoutes(locale) in storefront code */
export const ROUTES = getRoutes("en");

/** @deprecated Use getNavLinks(locale) */
export const NAV_LINKS = [
  { label: "Shop", href: ROUTES.shop },
  { label: "Collections", href: ROUTES.collections },
  { label: "About", href: ROUTES.about },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
