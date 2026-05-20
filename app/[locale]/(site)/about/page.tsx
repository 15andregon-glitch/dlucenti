import { notFound } from "next/navigation";
import { LucentiEditorialSection } from "@/sections/brand/LucentiEditorialSection";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { t } = await getTranslations(locale);
  return localizedPageMetadata(locale, t("pages.about.label"), t("pages.about.description"));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return <LucentiEditorialSection locale={locale} />;
}
