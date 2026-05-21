import { notFound } from "next/navigation";
import { ShopProductsPage } from "@/components/shop/ShopProductsPage";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { getProductsByShopAudience } from "@/services/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { t } = await getTranslations(locale);
  return localizedPageMetadata(
    locale,
    t("pages.shop.womenTitle"),
    t("pages.shop.description"),
  );
}

export default async function ShopWomenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { t } = await getTranslations(localeParam);
  const products = await getProductsByShopAudience("women");

  return (
    <ShopProductsPage
      title={t("pages.shop.womenTitle")}
      products={products}
      emptyLabel={t("pages.shop.empty")}
    />
  );
}
