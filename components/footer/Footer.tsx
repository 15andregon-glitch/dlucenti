import Link from "next/link";
import { NAV_LINKS, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/constants";
import { PageContainer } from "@/components/layout/PageContainer";

export function Footer() {
  return (
    <footer className="border-t border-[var(--maison-hairline)] bg-[var(--maison-beige)]">
      <PageContainer className="py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Link href={ROUTES.home} className="inline-block">
              <span className="text-maison-brand">Maison Aurélie</span>
            </Link>
            <p className="mt-6 max-w-xs text-maison-body-sm">{SITE.description}</p>
          </div>

          <div className="md:col-span-4">
            <p className="mb-5 text-maison-label">Explore</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-maison-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="mb-5 text-maison-label">Maison</p>
            <p className="text-maison-body-sm text-[var(--maison-charcoal)]">
              {SITE.heritage}
            </p>
            <p className="mt-3 text-maison-body-sm">
              By appointment · Paris, New York, Tokyo
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--maison-hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-maison-label">
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-maison-link">
              Privacy
            </Link>
            <Link href="#" className="text-maison-link">
              Terms
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
