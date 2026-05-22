import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { t, routes } = await getTranslations(localeParam);

  return (
    <main className="bg-[var(--maison-ivory)] pt-[calc(var(--header-height-mobile)+1.25rem)] pb-[clamp(3rem,8vw,7rem)] md:pt-32">
      <PageContainer>
        <div className="mx-auto max-w-xl text-center md:text-left">
          <p className="text-maison-label text-[var(--maison-mist)]">
            {t("checkout.cancelLabel")}
          </p>
          <h1 className="mt-4 font-editorial text-maison-headline text-[length:clamp(1.75rem,4vw,2.25rem)]">
            {t("checkout.cancelTitle")}
          </h1>
          <p className="mt-6 max-w-md font-sans text-[0.9375rem] leading-[1.7] text-[var(--maison-gray)]">
            {t("checkout.cancelDescription")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <Button href={routes.checkout} variant="solid">
              {t("checkout.retryCheckout")}
            </Button>
            <Button href={routes.shop} variant="outline">
              {t("checkout.returnToShop")}
            </Button>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
