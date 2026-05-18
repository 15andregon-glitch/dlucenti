import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { NewInProductCard } from "@/components/product/NewInProductCard";
import { Section } from "@/sections/shared/Section";
import { ROUTES } from "@/lib/routes";
import { getNewInProducts } from "@/services/products";

export async function NewInSection() {
  const products = await getNewInProducts();

  return (
    <Section
      id="new-in"
      tone="warm"
      className="border-t border-[var(--maison-hairline)] py-[clamp(4rem,10vw,6.5rem)]"
    >
      <PageContainer>
        <header className="mb-8 flex justify-end md:mb-10">
          <h2 className="sr-only">New In</h2>
          <Link
            href={ROUTES.shop}
            className="text-maison-link transition-colors duration-500 ease-[var(--ease-maison)] hover:text-[var(--maison-charcoal)]"
          >
            View all
          </Link>
        </header>

        <ul className="grid list-none grid-cols-2 items-stretch gap-6 p-0 sm:gap-7 md:gap-8 lg:grid-cols-4 lg:gap-10">
          {products.map((product) => (
            <li key={product.id} className="min-h-0">
              <NewInProductCard product={product} className="h-full" />
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
