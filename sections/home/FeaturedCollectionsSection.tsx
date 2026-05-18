import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/sections/shared/Section";
import { SectionHeader } from "@/sections/shared/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/lib/routes";
import { getFeaturedCollections } from "@/services/collections";

export async function FeaturedCollectionsSection() {
  const collections = await getFeaturedCollections();

  return (
    <Section id="collections" tone="beige">
      <PageContainer>
        <SectionHeader
          label="Collections"
          title={
            <>
              Seasonal <span className="text-maison-italic-soft">narratives</span>
            </>
          }
          description="Each collection is a cinematic chapter — composed with clarity and softness."
        />

        <div className="grid gap-px bg-[var(--maison-hairline)] md:grid-cols-3">
          {collections.map((collection) => (
            <Reveal key={collection.id}>
              <Link
                href={ROUTES.collection(collection.slug)}
                className="group relative flex min-h-[400px] flex-col justify-end bg-[var(--maison-surface)] p-7 transition-colors duration-600 hover:bg-[var(--maison-champagne)] md:min-h-[480px] md:p-8"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[var(--maison-ivory)]/90 via-transparent to-transparent"
                  aria-hidden
                />
                <div className="relative">
                  <p className="text-maison-label">{collection.season}</p>
                  <h3 className="mt-2 text-maison-title text-2xl md:text-[1.75rem] transition-colors duration-300 group-hover:text-[var(--maison-gold)]">
                    {collection.name}
                  </h3>
                  <p className="mt-3 max-w-xs text-maison-body-sm">
                    {collection.description}
                  </p>
                  <span className="mt-6 inline-block text-maison-link group-hover:text-[var(--maison-gold)]">
                    View collection
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
