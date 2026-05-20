import type { Locale } from "@/lib/i18n/locale";
import { localizedPath } from "@/lib/i18n/paths";
import type { ShopNavCategory } from "@/lib/shop-catalog";
import { SHOP_NAV_CATEGORIES } from "@/lib/shop-catalog";
import type { ShopAudienceSegment } from "@/lib/shop-audience";
import type { Messages } from "@/messages/en";

export type ShopNavItemKey = ShopAudienceSegment;

export interface ShopNavItem {
  key: ShopNavItemKey;
  segment: ShopAudienceSegment;
}

export function getShopNavItems(): readonly ShopNavItem[] {
  return [
    { key: "women", segment: "women" },
    { key: "men", segment: "men" },
    { key: "all", segment: "all" },
  ] as const;
}

export function shopMenuLabel(messages: Messages, key: ShopNavItemKey): string {
  return messages.shopMenu[key];
}

export function shopNavHref(locale: Locale, segment: ShopAudienceSegment): string {
  return localizedPath(locale, `/shop/${segment}`);
}

export function shopNavPieceHref(
  locale: Locale,
  audience: ShopAudienceSegment,
  category: ShopNavCategory,
): string {
  return localizedPath(locale, `/shop/${audience}/${category}`);
}

export function getShopNavCategories(): readonly ShopNavCategory[] {
  return SHOP_NAV_CATEGORIES;
}

export function shopPieceMenuLabel(
  messages: Messages,
  category: ShopNavCategory,
): string {
  return messages.shopMenu.pieces[category];
}

export function shopCatalogPageTitle(
  messages: Messages,
  audience: ShopAudienceSegment,
  category: ShopNavCategory,
): string {
  return `${shopMenuLabel(messages, audience)} — ${shopPieceMenuLabel(messages, category)}`;
}

/** @deprecated Use getShopNavItems() */
export const SHOP_MEGA_MENU = getShopNavItems();
