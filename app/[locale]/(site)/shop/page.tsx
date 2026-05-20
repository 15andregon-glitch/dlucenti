import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";
import { localizedPath } from "@/lib/i18n/paths";

/** /shop → /shop/all */
export default async function ShopIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  redirect(localizedPath(localeParam as Locale, "/shop/all"));
}
