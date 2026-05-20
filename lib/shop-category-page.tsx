import { notFound } from "next/navigation";
import { ShopProductsPage } from "@/components/shop/ShopProductsPage";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { isShopNavCategory, type ShopNavCategory } from "@/lib/shop-catalog";
import { shopCatalogPageTitle } from "@/lib/shop-nav";
import type { ShopAudienceSegment } from "@/lib/shop-audience";
import { getProductsByShopAudienceAndCategory } from "@/services/products";

export async function shopCategoryMetadata(
  localeParam: string,
  audience: ShopAudienceSegment,
  category: string,
) {
  if (!isValidLocale(localeParam) || !isShopNavCategory(category)) return {};
  const locale = localeParam as Locale;
  const { t, messages } = await getTranslations(locale);
  const title = shopCatalogPageTitle(messages, audience, category);
  return localizedPageMetadata(locale, title, t("pages.shop.description"));
}

export async function ShopCategoryPage({
  localeParam,
  audience,
  category,
}: {
  localeParam: string;
  audience: ShopAudienceSegment;
  category: string;
}) {
  if (!isValidLocale(localeParam) || !isShopNavCategory(category)) notFound();
  const locale = localeParam as Locale;
  const { messages } = await getTranslations(locale);
  const products = await getProductsByShopAudienceAndCategory(
    audience,
    category as ShopNavCategory,
  );
  const title = shopCatalogPageTitle(messages, audience, category as ShopNavCategory);

  return <ShopProductsPage title={title} products={products} />;
}
