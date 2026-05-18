import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductCard } from "@/components/product/ProductCard";
import { getCollectionBySlug } from "@/services/collections";
import { getProductsByCollection } from "@/services/products";
import { pageMetadata } from "@/lib/metadata";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return pageMetadata("Collection");
  return pageMetadata(collection.name, collection.description);
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getProductsByCollection(slug);

  return (
    <>
      <PageHero
        label={collection.season}
        title={collection.name}
        description={collection.description}
      />
      <PageContainer className="pb-[var(--section-py)]">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </>
  );
}
