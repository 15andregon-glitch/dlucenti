import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { getTranslations } from "@/lib/i18n/translations";
import { isValidLocale } from "@/lib/i18n/locale";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { session_id: sessionId } = await searchParams;
  if (!isValidLocale(localeParam)) notFound();

  const { t, routes } = await getTranslations(localeParam);

  return (
    <main className="bg-[var(--maison-ivory)] pt-28 pb-[clamp(4rem,10vw,7rem)] md:pt-32">
      <ClearCartOnSuccess sessionId={sessionId} />
      <PageContainer>
        <div className="mx-auto max-w-xl text-center md:text-left">
          <p className="text-maison-label text-[var(--maison-gold)]">
            {t("checkout.successLabel")}
          </p>
          <h1 className="mt-4 font-editorial text-maison-headline text-[length:clamp(1.75rem,4vw,2.25rem)]">
            {t("checkout.successTitle")}
          </h1>
          <p className="mt-6 max-w-md font-sans text-[0.9375rem] leading-[1.7] text-[var(--maison-gray)]">
            {t("checkout.successDescription")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <Button href={routes.shop} variant="solid">
              {t("checkout.returnToShop")}
            </Button>
            <Link
              href={routes.home}
              className="font-sans text-[var(--maison-chrome-size)] text-[var(--maison-gray)] transition-opacity duration-500 ease-[var(--ease-maison)] hover:text-[var(--maison-charcoal)]"
            >
              {t("checkout.backHome")}
            </Link>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
