import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
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
  return localizedPageMetadata(locale, t("pages.contact.label"), t("pages.contact.description"));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const { t, messages } = await getTranslations(localeParam);

  return (
    <>
      <PageHero
        label={t("pages.contact.label")}
        title={t("pages.contact.title")}
        description={t("pages.contact.description")}
      />
      <PageContainer className="pb-[var(--section-py)]">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <p className="text-maison-label">{t("pages.contact.ateliers")}</p>
            <p className="mt-3 text-maison-title text-lg">{t("pages.contact.cities")}</p>
            <p className="mt-6 text-maison-body-sm">{messages.meta.heritage}</p>
          </div>
          <form className="space-y-5" action="#">
            <div>
              <label className="text-maison-label" htmlFor="name">
                {t("pages.contact.name")}
              </label>
              <input
                id="name"
                name="name"
                className="mt-1.5 w-full border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] focus:border-[var(--maison-charcoal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-maison-label" htmlFor="email">
                {t("checkout.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1.5 w-full border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] focus:border-[var(--maison-charcoal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-maison-label" htmlFor="message">
                {t("pages.contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-1.5 w-full resize-none border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] focus:border-[var(--maison-charcoal)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="border border-[var(--maison-hairline-strong)] px-7 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] transition-colors hover:border-[var(--maison-charcoal)]"
            >
              {t("pages.contact.send")}
            </button>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
