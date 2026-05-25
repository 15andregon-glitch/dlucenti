import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialGuideAside } from "@/components/editorial/EditorialGuideAside";
import { EditorialGuideSection } from "@/components/editorial/EditorialGuideSection";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { getFooterContentForLocale } from "@/services/footer";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";
import { localizedPageMetadata } from "@/lib/i18n/metadata";

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
    t("pages.returns.title"),
    t("pages.returns.description"),
  );
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { t, routes } = await getTranslations(localeParam);
  const footer = await getFooterContentForLocale(localeParam);

  return (
    <>
      <PageHero
        label={t("pages.returns.label")}
        title={t("pages.returns.title")}
        description={t("pages.returns.description")}
      />
      <PageContainer className="pb-[var(--section-py)] pt-[clamp(2rem,5vw,3.5rem)]">
        <div className="editorial-guide mx-auto max-w-3xl">
          <div className="space-y-0">
            <EditorialGuideSection title={t("pages.returns.windowTitle")}>
              <p>{t("pages.returns.window")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.returns.conditionsTitle")}>
              <p>{t("pages.returns.conditions")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.returns.refundTitle")}>
              <p>{t("pages.returns.refund")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.returns.contactTitle")}>
              <p>{t("pages.returns.contact")}</p>
              <p>
                <Link href={routes.contact} className="text-maison-link">
                  {t("pages.returns.contactCta")}
                </Link>
                {" · "}
                <a
                  href={`mailto:${footer.contactEmail}`}
                  className="text-maison-link"
                >
                  {footer.contactEmail}
                </a>
              </p>
            </EditorialGuideSection>
          </div>

          <EditorialGuideAside
            text={t("pages.returns.shippingNote")}
            linkLabel={t("pages.returns.shippingLink")}
            linkHref={routes.shipping}
          />
        </div>
      </PageContainer>
    </>
  );
}
