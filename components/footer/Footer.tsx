import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import { createTranslator } from "@/lib/i18n/translations";
import { getNavLinks, getRoutes } from "@/lib/routes";
import { getFooterContentForLocale } from "@/services/footer";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PageContainer } from "@/components/layout/PageContainer";

interface FooterProps {
  locale: Locale;
}

export async function Footer({ locale }: FooterProps) {
  const messages = getDictionary(locale);
  const t = createTranslator(messages);
  const routes = getRoutes(locale);
  const navLinks = getNavLinks(locale);
  const footer = await getFooterContentForLocale(locale);

  const navLabels: Record<(typeof navLinks)[number]["key"], string> = {
    shop: t("nav.shop"),
    collections: t("nav.collections"),
    about: t("nav.aboutNav"),
  };

  const legalLinks = [
    { key: "privacy", label: messages.footer.privacy, href: "#" },
    { key: "terms", label: messages.footer.terms, href: "#" },
    { key: "admin", label: messages.footer.admin, href: "/admin/login" },
  ];

  return (
    <footer className="border-t border-[var(--maison-hairline)] bg-[var(--maison-beige)]">
      <PageContainer className="py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <BrandLogo
              href={routes.home}
              variant="footer"
              className="text-[var(--maison-charcoal)]"
            />
            <p className="mt-6 max-w-xs text-maison-body-sm">{footer.slogan}</p>
            <div className="mt-8">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="mb-5 text-maison-label">{footer.exploreTitle}</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-maison-link">
                    {navLabels[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="mb-5 text-maison-label">{footer.maisonTitle}</p>
            <p className="text-maison-body-sm text-[var(--maison-charcoal)]">
              {footer.location}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="mb-5 text-maison-label">{footer.contactsTitle}</p>
            <a href={`mailto:${footer.contactEmail}`} className="text-maison-link">
              {footer.contactEmail}
            </a>
          </div>

          <div className="md:col-span-2">
            <p className="mb-5 text-maison-label">{footer.socialsTitle}</p>
            <ul className="space-y-2.5">
              {footer.socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="text-maison-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--maison-hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-maison-label">
            © {new Date().getFullYear()} {messages.meta.siteName}
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link key={link.key} href={link.href} className="text-maison-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
