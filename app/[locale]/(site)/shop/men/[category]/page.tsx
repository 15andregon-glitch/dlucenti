import { shopCategoryMetadata, ShopCategoryPage } from "@/lib/shop-category-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return shopCategoryMetadata(locale, "men", category);
}

export default async function ShopMenCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return <ShopCategoryPage localeParam={locale} audience="men" category={category} />;
}
