import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { ROUTES } from "@/lib/routes";
import { getJournalPosts } from "@/services/journal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Journal");

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <>
      <PageHero
        label="Journal"
        title="Stories of light"
        description="Campaigns, craft, and the quiet architecture of desire."
      />
      <PageContainer className="pb-[var(--section-py)]">
        <div className="divide-y divide-[var(--maison-hairline)]">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={ROUTES.journalPost(post.slug)}
              className="group block py-10 first:pt-0"
            >
              <p className="text-maison-label">{post.category}</p>
              <h2 className="mt-2 text-maison-title text-2xl md:text-3xl transition-colors duration-400 group-hover:text-[var(--maison-gold)]">
                {post.title}
              </h2>
              <p className="mt-3 max-w-2xl text-maison-body-sm">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
