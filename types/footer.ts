import type { Locale } from "@/lib/i18n/locale";

export type FooterLocalizedFields = {
  en: string;
  pt: string;
};

export type FooterSocialLink = {
  id: string;
  label: string;
  url: string;
};

export type FooterContent = {
  contactEmail: string;
  slogan: FooterLocalizedFields;
  location: FooterLocalizedFields;
  exploreTitle: FooterLocalizedFields;
  maisonTitle: FooterLocalizedFields;
  contactsTitle: FooterLocalizedFields;
  socialsTitle: FooterLocalizedFields;
  socialLinks: FooterSocialLink[];
};

export type FooterContentView = {
  contactEmail: string;
  slogan: string;
  location: string;
  exploreTitle: string;
  maisonTitle: string;
  contactsTitle: string;
  socialsTitle: string;
  socialLinks: FooterSocialLink[];
};

export function resolveFooterForLocale(
  content: FooterContent,
  locale: Locale,
): FooterContentView {
  return {
    contactEmail: content.contactEmail,
    slogan: content.slogan[locale],
    location: content.location[locale],
    exploreTitle: content.exploreTitle[locale],
    maisonTitle: content.maisonTitle[locale],
    contactsTitle: content.contactsTitle[locale],
    socialsTitle: content.socialsTitle[locale],
    socialLinks: content.socialLinks,
  };
}
