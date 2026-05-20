import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { isValidLocale, type Locale } from "@/lib/i18n/locale";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  return <SiteShell locale={localeParam as Locale}>{children}</SiteShell>;
}
