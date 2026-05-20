import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { Locale } from "@/lib/i18n/locale";
import { getCollections } from "@/services/collections";

interface SiteShellProps {
  children: React.ReactNode;
  locale: Locale;
}

/** Public site chrome — navbar + main + footer */
export async function SiteShell({ children, locale }: SiteShellProps) {
  const collectionsNav = await getCollections();

  return (
    <>
      <Navbar locale={locale} collectionsNav={collectionsNav} />
      <div className="flex min-h-screen flex-col">{children}</div>
      <Footer locale={locale} />
      <CartDrawer />
    </>
  );
}
