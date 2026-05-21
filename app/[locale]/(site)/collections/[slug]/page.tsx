import { notFound } from "next/navigation";
import { CollectionEditorialBlocks } from "@/components/collections/CollectionEditorialBlocks";
import { CollectionEditorialStory } from "@/components/collections/CollectionEditorialStory";
import { CollectionProductReveal } from "@/components/collections/CollectionProductReveal";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { getTranslations } from "@/lib/i18n/translations";
import { getCollectionBySlug } from "@/services/collections";
import { getProductsByCollection } from "@/services/products";

interface CollectionPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return localizedPageMetadata(
    locale,
    collection.metaTitle || collection.editorialTitle || collection.name,
    collection.metaDescription || collection.description,
  );
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getProductsByCollection(slug);
  const { t } = await getTranslations(localeParam);

  const title = collection.editorialTitle || collection.name;

  return (
    <article className="flex min-h-[100dvh] flex-col justify-center bg-[var(--maison-warm-white)] pt-[calc(4.25rem+0.75rem)] pb-[clamp(2.5rem,6vw,4rem)] md:pt-[calc(4.75rem+1rem)]">
      <h1 className="sr-only">{title}</h1>
      <CollectionEditorialStory collection={collection} />
      <CollectionEditorialBlocks collection={collection} />
      <CollectionProductReveal
        products={products}
        collectionTitle={collection.editorialTitle || collection.name}
        sectionLabel={t("collections.productsSection")}
      />
    </article>
  );
}
