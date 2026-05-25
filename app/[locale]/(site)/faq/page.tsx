import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EditorialFaqAccordion,
  type FaqItem,
} from "@/components/editorial/EditorialFaqAccordion";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { getFooterContentForLocale } from "@/services/footer";
import { getTranslations } from "@/lib/i18n/translations";
import type { MessageKey } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";

const FAQ_KEYS = [
  "shipping",
  "tracking",
  "returns",
  "materials",
  "care",
  "payment",
  "support",
] as const;

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
    t("pages.faq.title"),
    t("pages.faq.description"),
  );
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { t, routes } = await getTranslations(localeParam);
  const footer = await getFooterContentForLocale(localeParam);

  const items: FaqItem[] = FAQ_KEYS.map((id) => ({
    id,
    question: t(`pages.faq.items.${id}.q` as MessageKey),
    answer: t(`pages.faq.items.${id}.a` as MessageKey),
  }));

  return (
    <>
      <PageHero
        label={t("pages.faq.label")}
        title={t("pages.faq.title")}
        description={t("pages.faq.description")}
      />
      <PageContainer className="pb-[var(--section-py)] pt-[clamp(2rem,5vw,3.5rem)]">
        <EditorialFaqAccordion items={items} />
        <p className="mt-12 max-w-xl font-sans text-[0.875rem] leading-[1.75] text-[var(--maison-mist)] md:mt-14">
          <Link href={routes.contact} className="text-maison-link text-[var(--maison-charcoal)]">
            {t("footer.contact")}
          </Link>
          {" · "}
          <a
            href={`mailto:${footer.contactEmail}`}
            className="text-maison-link text-[var(--maison-charcoal)]"
          >
            {footer.contactEmail}
          </a>
        </p>
      </PageContainer>
    </>
  );
}
