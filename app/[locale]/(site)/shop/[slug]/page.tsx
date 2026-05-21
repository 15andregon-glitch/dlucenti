import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductDetailGallery } from "@/sections/product/ProductDetailGallery";
import { ProductMaterialsSection } from "@/sections/product/ProductMaterialsSection";
import { RelatedProductsSection } from "@/sections/product/RelatedProductsSection";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { formatPrice } from "@/lib/cart";
import { resolveProductEditorialBadge } from "@/lib/product-editorial-visibility";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/services/products";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return localizedPageMetadata(locale, product.name, product.description);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { t } = await getTranslations(localeParam);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const editorialBadge = resolveProductEditorialBadge(product, {
    soldOut: t("product.soldOut"),
    newIn: t("product.newIn"),
  });

  return (
    <article className="bg-[var(--maison-ivory)]">
      <section className="pt-28 pb-[clamp(3rem,8vw,5rem)] md:pt-32">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
            <ProductGallery product={product} />

            <div className="lg:sticky lg:top-28 lg:pt-2">
              {editorialBadge ? (
                <p
                  className={
                    editorialBadge.variant === "soldOut"
                      ? "text-maison-label text-[var(--maison-mist)]"
                      : "text-maison-label text-[var(--maison-gold)]"
                  }
                >
                  {editorialBadge.label}
                </p>
              ) : null}

              <h1 className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal leading-[1.12] tracking-tight text-[var(--maison-charcoal)]">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="mt-3 font-sans text-[var(--maison-chrome-size)] text-[var(--maison-mist)]">
                  {product.subtitle}
                </p>
              )}

              <p className="mt-6 font-sans text-[0.9375rem] tabular-nums leading-none tracking-[var(--tracking-normal)] text-[var(--maison-charcoal)]">
                {formatPrice(product.price, product.currency, localeParam)}
              </p>

              <p className="mt-8 max-w-md text-maison-body-sm leading-[1.65] text-[var(--maison-gray)]">
                {product.description}
              </p>

              <ProductPurchase product={product} />
            </div>
          </div>
        </PageContainer>
      </section>

      <ProductDetailGallery product={product} />
      <ProductMaterialsSection product={product} locale={localeParam} />
      <RelatedProductsSection products={related} locale={localeParam} />
    </article>
  );
}
