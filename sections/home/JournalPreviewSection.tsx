import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/sections/shared/Section";
import { SectionHeader } from "@/sections/shared/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/lib/routes";
import { getJournalPosts } from "@/services/journal";

export async function JournalPreviewSection() {
  const posts = await getJournalPosts();

  return (
    <Section id="journal" tone="beige" className="border-t border-[var(--maison-hairline)]">
      <PageContainer>
        <SectionHeader
          label="Journal"
          title="Stories of light"
          description="Campaigns, craft, and the quiet architecture of desire."
        />

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {posts.map((post) => (
            <Reveal key={post.id}>
              <Link href={ROUTES.journalPost(post.slug)} className="group block">
                <div className="aspect-[4/5] bg-[var(--maison-champagne)] transition-colors duration-500 group-hover:bg-[var(--maison-surface)]" />
                <p className="mt-4 text-maison-label">{post.category}</p>
                <h3 className="mt-1.5 text-maison-title transition-colors duration-400 group-hover:text-[var(--maison-gold)]">
                  {post.title}
                </h3>
                <p className="mt-2 text-maison-body-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
