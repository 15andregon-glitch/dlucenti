import { notFound } from "next/navigation";
import {
  HeroSection,
  NewInSection,
  FeaturedCollectionsSection,
  CampaignGallerySection,
} from "@/sections";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return (
    <main>
      <HeroSection />
      <NewInSection locale={locale} />
      <FeaturedCollectionsSection locale={locale} />
      <CampaignGallerySection />
    </main>
  );
}
