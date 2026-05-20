import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductCard } from "@/components/product/ProductCard";
import type { ShopAudienceSegment } from "@/lib/shop-audience";
import type { Product } from "@/lib/types";

interface ShopProductsPageProps {
  title: string;
  products: Product[];
}

export function ShopProductsPage({ title, products }: ShopProductsPageProps) {
  return (
    <>
      <PageHero title={title} />
      <PageContainer className="pt-[clamp(2.5rem,5vw,4.5rem)] pb-[var(--section-py)] md:pt-[clamp(3rem,6vw,5rem)]">
        {products.length === 0 ? (
          <p className="text-center text-maison-body-sm text-[var(--maison-mist)]">
            —
          </p>
        ) : (
          <ul className="grid list-none grid-cols-2 items-stretch gap-6 p-0 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
            {products.map((product) => (
              <li key={product.id} className="min-h-0">
                <ProductCard product={product} className="h-full" />
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </>
  );
}

export type { ShopAudienceSegment };
