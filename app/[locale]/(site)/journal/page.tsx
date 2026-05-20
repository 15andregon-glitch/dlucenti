import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";
import { getJournalPosts } from "@/services/journal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { t } = await getTranslations(locale);
  return localizedPageMetadata(
    locale,
    t("pages.journal.label"),
    t("pages.journal.description"),
  );
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { t, routes } = await getTranslations(localeParam);
  const posts = await getJournalPosts();

  return (
    <>
      <PageHero
        label={t("pages.journal.label")}
        title={t("pages.journal.title")}
        description={t("pages.journal.description")}
      />
      <PageContainer className="pb-[var(--section-py)]">
        <div className="divide-y divide-[var(--maison-hairline)]">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={routes.journalPost(post.slug)}
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
