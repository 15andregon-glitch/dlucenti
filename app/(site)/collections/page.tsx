import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { ROUTES } from "@/lib/routes";
import { getCollections } from "@/services/collections";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Collections");

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <PageHero
        label="Collections"
        title="Seasonal chapters"
        description="Each collection is a cinematic narrative — light, shadow, and quiet refinement."
      />
      <PageContainer className="pb-[var(--section-py)]">
        <div className="space-y-px bg-[var(--maison-hairline)]">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={ROUTES.collection(collection.slug)}
              className="group flex flex-col justify-between gap-5 bg-[var(--maison-surface)] p-7 transition-colors duration-500 hover:bg-[var(--maison-champagne)] md:flex-row md:items-center md:p-10"
            >
              <div>
                <p className="text-maison-label">{collection.season}</p>
                <h2 className="mt-1.5 text-maison-headline text-3xl md:text-4xl">
                  {collection.name}
                </h2>
              </div>
              <p className="max-w-md text-maison-body-sm">{collection.description}</p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
