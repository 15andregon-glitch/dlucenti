import { ROUTES } from "@/lib/routes";

export type ShopAudience = "women" | "men";

export type ShopNavCategory =
  | "necklaces"
  | "bracelets"
  | "earrings"
  | "rings";

export interface ShopNavItem {
  label: string;
  category?: ShopNavCategory;
}

export interface ShopNavGroup {
  label: string;
  audience: ShopAudience;
  items: readonly ShopNavItem[];
}

export const SHOP_MEGA_MENU: readonly ShopNavGroup[] = [
  {
    label: "Women",
    audience: "women",
    items: [
      { label: "View all" },
      { label: "Necklaces", category: "necklaces" },
      { label: "Bracelets", category: "bracelets" },
      { label: "Earrings", category: "earrings" },
      { label: "Rings", category: "rings" },
    ],
  },
  {
    label: "Men",
    audience: "men",
    items: [
      { label: "View all" },
      { label: "Necklaces", category: "necklaces" },
      { label: "Bracelets", category: "bracelets" },
      { label: "Rings", category: "rings" },
    ],
  },
] as const;

export function shopNavHref(
  audience: ShopAudience,
  category?: ShopNavCategory,
): string {
  const params = new URLSearchParams({ audience });
  if (category) params.set("category", category);
  return `${ROUTES.shop}?${params.toString()}`;
}
