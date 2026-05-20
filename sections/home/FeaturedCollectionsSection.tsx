import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/sections/shared/Section";
import { SectionHeader } from "@/sections/shared/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getCollectionArchivePosterUrl } from "@/lib/collections-storefront";
import { getTranslations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";
import { getFeaturedCollections } from "@/services/collections";

export async function FeaturedCollectionsSection({ locale }: { locale: Locale }) {
  const { t, routes } = await getTranslations(locale);
  const collections = await getFeaturedCollections();

  return (
    <Section id="collections" tone="beige">
      <PageContainer>
        <SectionHeader
          align="center"
          className="mb-[clamp(4.5rem,14vw,9.5rem)] md:mb-[clamp(5.5rem,16vw,11rem)]"
          title={
            <>
              {t("collections.title").replace(t("collections.titleEmphasis"), "")}
              <span className="text-maison-italic-soft">{t("collections.titleEmphasis")}</span>
            </>
          }
          description={t("collections.description")}
        />

        <div className="grid gap-px bg-[var(--maison-hairline)] md:grid-cols-3">
          {collections.map((collection, index) => {
            const poster = getCollectionArchivePosterUrl(collection);

            return (
              <Reveal key={collection.id}>
                <Link
                  href={routes.collection(collection.slug)}
                  className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden bg-[var(--maison-champagne)] p-7 transition-colors duration-600 hover:bg-[var(--maison-surface)] md:min-h-[480px] md:p-8"
                >
                  {poster ? (
                    <Image
                      src={poster}
                      alt={collection.name}
                      fill
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-[transform,filter] duration-700 ease-[var(--ease-maison)] group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[var(--maison-ivory)]/95 via-[var(--maison-ivory)]/35 to-transparent"
                    aria-hidden
                  />
                  <div className="relative">
                    <p className="text-maison-label">{collection.season}</p>
                    <h3 className="mt-2 text-maison-title text-2xl transition-colors duration-300 group-hover:text-[var(--maison-gold)] md:text-[1.75rem]">
                      {collection.name}
                    </h3>
                    <p className="mt-3 max-w-xs text-maison-body-sm">
                      {collection.description}
                    </p>
                    <span className="mt-6 inline-block text-maison-link group-hover:text-[var(--maison-gold)]">
                      {t("collections.viewCollection")}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </PageContainer>
    </Section>
  );
}
