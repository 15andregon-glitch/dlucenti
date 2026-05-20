import type { Product } from "@/lib/types";
import { PageContainer } from "@/components/layout/PageContainer";
import { getTranslations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";

interface ProductMaterialsSectionProps {
  product: Product;
  locale: Locale;
}

export async function ProductMaterialsSection({
  product,
  locale,
}: ProductMaterialsSectionProps) {
  if (!product.materials) return null;

  const { t } = await getTranslations(locale);

  return (
    <section
      aria-label={t("product.materials")}
      className="border-t border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] py-[clamp(3.5rem,8vw,5.5rem)]"
    >
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center md:text-left">
          <p className="text-maison-label">{t("product.materials")}</p>
          <p className="mt-6 text-maison-body-sm leading-[1.65] text-[var(--maison-gray)]">
            {product.materials}
          </p>
          <p className="mt-6 text-maison-body-sm leading-[1.65] text-[var(--maison-mist)]">
            {t("product.materialsNote")}
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
