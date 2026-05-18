import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { getJournalPostBySlug } from "@/services/journal";
import { pageMetadata } from "@/lib/metadata";

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JournalPostPageProps) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return pageMetadata("Journal");
  return pageMetadata(post.title, post.excerpt);
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params;
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
