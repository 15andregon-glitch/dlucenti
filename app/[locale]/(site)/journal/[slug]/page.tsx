import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { getJournalPostBySlug } from "@/services/journal";

interface JournalPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: JournalPostPageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};
  return localizedPageMetadata(locale, post.title, post.excerpt);
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero label={post.category} title={post.title} description={post.excerpt} />
      <PageContainer className="pb-[var(--section-py)]">
        <article className="max-w-2xl">
          <p className="text-maison-body text-base leading-relaxed">
            Editorial content for &ldquo;{post.title}&rdquo; will live here — campaign
            imagery, atelier photography, and maison storytelling composed for the
            screen.
          </p>
        </article>
      </PageContainer>
    </>
  );
}
