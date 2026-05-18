import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface SiteShellProps {
  children: React.ReactNode;
}

/** Public site chrome — navbar + main + footer */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col">{children}</div>
      <Footer />
      <CartDrawer />
    </>
  );
}
