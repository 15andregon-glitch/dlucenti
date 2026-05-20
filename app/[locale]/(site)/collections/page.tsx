import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { CollectionsArchiveAtmosphere } from "@/components/collections/CollectionsArchiveAtmosphere";
import { CollectionsEditorialArchive } from "@/components/collections/CollectionsEditorialArchive";
import { CollectionsEmptyState } from "@/components/collections/CollectionsEmptyState";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { getCollections } from "@/services/collections";

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
    t("pages.collections.label"),
    t("pages.collections.description"),
  );
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const { t } = await getTranslations(locale);
  const collections = await getCollections();

  if (!collections.length) {
    return (
      <main className="collections-archive relative isolate min-h-screen">
        <CollectionsArchiveAtmosphere />
        <CollectionsEmptyState
          title={t("collections.emptyTitle")}
          description={t("collections.emptyDescription")}
        />
      </main>
    );
  }

  return (
    <main className="collections-archive relative isolate min-h-screen">
      <CollectionsArchiveAtmosphere />
      <PageContainer className="relative z-10 flex flex-col items-center pb-[clamp(4rem,10vw,6rem)] pt-[calc(4.25rem+1rem)] md:pt-[calc(4.75rem+1.25rem)]">
        <CollectionsEditorialArchive
          collections={collections}
          locale={locale}
          leadSpacing="pt-[clamp(4.5rem,14vw,9.5rem)] md:pt-[clamp(5.5rem,16vw,11rem)]"
        />
      </PageContainer>
    </main>
  );
}
