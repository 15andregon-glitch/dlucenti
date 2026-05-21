import { PageContainer } from "@/components/layout/PageContainer";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

interface CollectionProductRevealProps {
  products: Product[];
  collectionTitle: string;
  sectionLabel: string;
}

export function CollectionProductReveal({
  products,
  collectionTitle,
  sectionLabel,
}: CollectionProductRevealProps) {
  if (!products.length) return null;

  return (
    <section className="bg-[var(--maison-warm-white)]">
      <PageContainer>
        <p className="text-maison-label">{sectionLabel}</p>
        <h2 className="mt-2 max-w-xl text-maison-headline text-2xl md:text-3xl">
          {collectionTitle}
        </h2>
        <ul className="mt-8 grid list-none grid-cols-2 gap-6 p-0 md:mt-10 md:grid-cols-3 md:gap-10 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="min-h-0">
              <ProductCard product={product} className="h-full" />
            </li>
          ))}
        </ul>
      </PageContainer>
    </section>
  );
}
