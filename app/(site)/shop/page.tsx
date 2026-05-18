import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/services/products";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Shop");

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        label="Shop"
        title="All pieces"
        description="Fine jewelry composed with couture restraint — rings, necklaces, earrings, and objects."
      />
      <PageContainer className="pb-[var(--section-py)]">
        <ul className="grid list-none grid-cols-2 items-stretch gap-6 p-0 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
          {products.map((product) => (
            <li key={product.id} className="min-h-0">
              <ProductCard product={product} className="h-full" />
            </li>
          ))}
        </ul>
      </PageContainer>
    </>
  );
}
