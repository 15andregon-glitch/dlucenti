import { PageContainer } from "@/components/layout/PageContainer";
import { ProductCard } from "@/components/product/ProductCard";
import { getTranslations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";
import type { Product } from "@/lib/types";

interface RelatedProductsSectionProps {
  products: Product[];
  locale: Locale;
}

export async function RelatedProductsSection({
  products,
  locale,
}: RelatedProductsSectionProps) {
  if (products.length === 0) return null;

  const { t } = await getTranslations(locale);

  return (
    <section
      aria-label={t("product.related")}
      className="border-t border-[var(--maison-hairline)] bg-[var(--maison-ivory)] py-[clamp(4rem,10vw,6.5rem)]"
    >
      <PageContainer>
        <header className="mb-10 flex items-baseline justify-between gap-6 md:mb-12">
          <h2 className="font-sans text-[var(--maison-chrome-size)] font-normal tracking-[var(--tracking-normal)] text-[var(--maison-charcoal)]">
            {t("product.related")}
          </h2>
        </header>

        <ul className="grid list-none grid-cols-2 items-stretch gap-6 p-0 md:grid-cols-3 md:gap-8 lg:gap-10">
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
