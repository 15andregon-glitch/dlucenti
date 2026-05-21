import { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { Locale } from "@/lib/i18n/locale";
import { getCollections } from "@/services/collections";

interface SiteShellProps {
  children: React.ReactNode;
  locale: Locale;
}

async function NavbarWithCollections({ locale }: { locale: Locale }) {
  const collectionsNav = await getCollections();
  return <Navbar locale={locale} collectionsNav={collectionsNav} />;
}

/** Public site chrome — page content streams without waiting on nav/footer data */
export function SiteShell({ children, locale }: SiteShellProps) {
  return (
    <>
      <Suspense fallback={<Navbar locale={locale} collectionsNav={[]} />}>
        <NavbarWithCollections locale={locale} />
      </Suspense>
      <div className="flex min-h-screen flex-col">{children}</div>
      <Suspense fallback={null}>
        <Footer locale={locale} />
      </Suspense>
      <CartDrawer />
    </>
  );
}
