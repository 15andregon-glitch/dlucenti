import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SetHtmlLang } from "@/components/layout/SetHtmlLang";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidLocale, toIntlLocale, type Locale } from "@/lib/i18n/locale";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const messages = getDictionary(locale);

  return (
    <>
      <SetHtmlLang locale={locale} />
      <LocaleProvider locale={locale} messages={messages}>
        {children}
      </LocaleProvider>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "en";
  const messages = getDictionary(locale);
  return {
    openGraph: { locale: toIntlLocale(locale) },
  };
}
