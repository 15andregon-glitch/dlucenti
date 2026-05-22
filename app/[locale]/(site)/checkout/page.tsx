import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { StripeCheckout } from "@/components/checkout/StripeCheckout";
import { OrderSummary } from "@/components/checkout/OrderSummary";
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
    t("pages.checkout.label"),
    t("checkout.pageDescription"),
  );
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const { t } = await getTranslations(localeParam);

  return (
    <main className="bg-[var(--maison-ivory)] pt-[calc(var(--header-height-mobile)+1.25rem)] pb-[clamp(3rem,8vw,7rem)] md:pt-32">
      <PageContainer>
        <header className="max-w-xl">
          <p className="text-maison-label text-[var(--maison-gold)]">
            {t("pages.checkout.label")}
          </p>
          <h1 className="mt-3 font-editorial text-maison-headline text-[length:clamp(1.75rem,4vw,2.25rem)]">
            {t("pages.checkout.title")}
          </h1>
        </header>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:gap-20 xl:gap-24">
          <div className="min-w-0 max-w-xl">
            <StripeCheckout />
          </div>
          <div className="border-t border-[var(--maison-hairline)] pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:pl-16">
            <OrderSummary />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
