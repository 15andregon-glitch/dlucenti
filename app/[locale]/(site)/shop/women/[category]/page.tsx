import { shopCategoryMetadata, ShopCategoryPage } from "@/lib/shop-category-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return shopCategoryMetadata(locale, "women", category);
}

export default async function ShopWomenCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return <ShopCategoryPage localeParam={locale} audience="women" category={category} />;
}
