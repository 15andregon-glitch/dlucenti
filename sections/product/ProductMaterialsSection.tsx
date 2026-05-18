import type { Product } from "@/lib/types";
import { PageContainer } from "@/components/layout/PageContainer";

interface ProductMaterialsSectionProps {
  product: Product;
}

export function ProductMaterialsSection({
  product,
}: ProductMaterialsSectionProps) {
  if (!product.materials) return null;

  return (
    <section
      aria-label="Materials and craftsmanship"
      className="border-t border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] py-[clamp(3.5rem,8vw,5.5rem)]"
    >
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center md:text-left">
          <p className="text-maison-label">Materials & craftsmanship</p>
          <p className="mt-6 text-maison-body-sm leading-[1.65] text-[var(--maison-gray)]">
            {product.materials}
          </p>
          <p className="mt-6 text-maison-body-sm leading-[1.65] text-[var(--maison-mist)]">
            Each piece is composed by hand in our Paris atelier. Minor
            variations in tone and form are a mark of artisanal work — never a
            flaw.
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
