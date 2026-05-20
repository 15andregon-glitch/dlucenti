import type { ProductTargetGender } from "@/types/database/schema";

/** Storefront shop URL segment — maps to /shop/women, /shop/men, /shop/all */
export type ShopAudienceSegment = "women" | "men" | "all";

const SHOP_AUDIENCE_SEGMENTS: readonly ShopAudienceSegment[] = [
  "women",
  "men",
  "all",
];

export function isShopAudienceSegment(value: string): value is ShopAudienceSegment {
  return (SHOP_AUDIENCE_SEGMENTS as readonly string[]).includes(value);
}

/** DB genders included when browsing a shop audience */
export function targetGendersForAudience(
  audience: ShopAudienceSegment,
): ProductTargetGender[] {
  switch (audience) {
    case "women":
      return ["women", "unisex"];
    case "men":
      return ["men", "unisex"];
    case "all":
      return ["women", "men", "unisex"];
  }
}
