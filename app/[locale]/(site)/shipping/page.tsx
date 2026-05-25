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
    t("pages.shipping.title"),
    t("pages.shipping.description"),
  );
}

export default async function ShippingPage({
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
        label={t("pages.shipping.label")}
        title={t("pages.shipping.title")}
        description={t("pages.shipping.description")}
      />
      <PageContainer className="pb-[var(--section-py)] pt-[clamp(2rem,5vw,3.5rem)]">
        <div className="editorial-guide mx-auto max-w-3xl">
          <p className="max-w-xl font-sans text-[0.9375rem] leading-[1.75] text-[var(--maison-gray)]">
            {t("pages.shipping.intro")}
          </p>

          <div className="mt-10 md:mt-12">
            <EditorialGuideSection title={t("pages.shipping.processingTitle")}>
              <p>{t("pages.shipping.processing")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.shipping.shippingTitle")}>
              <p>{t("pages.shipping.shippingPortugal")}</p>
              <p>{t("pages.shipping.shippingEurope")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.shipping.trackingTitle")}>
              <p>{t("pages.shipping.tracking")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.shipping.internationalTitle")}>
              <p>{t("pages.shipping.international")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.shipping.costTitle")}>
              <p>{t("pages.shipping.cost")}</p>
            </EditorialGuideSection>

            <EditorialGuideSection title={t("pages.shipping.contactTitle")}>
              <p>{t("pages.shipping.contact")}</p>
              <p>
                <Link href={routes.contact} className="text-maison-link">
                  {t("pages.shipping.contactCta")}
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
            text={t("pages.shipping.returnsNote")}
            linkLabel={t("pages.shipping.returnsLink")}
            linkHref={routes.returns}
          />
        </div>
      </PageContainer>
    </>
  );
}
