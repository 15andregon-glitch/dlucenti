import type { FooterContent } from "@/types/footer";
import type { FooterSettingsRow, FooterSocialLinkRow } from "@/types/database";

export function mapFooterContent(
  settings: FooterSettingsRow | null,
  links: FooterSocialLinkRow[],
): FooterContent | null {
  if (!settings) return null;

  return {
    contactEmail: settings.contact_email,
    slogan: { en: settings.slogan_en, pt: settings.slogan_pt },
    location: { en: settings.location_en, pt: settings.location_pt },
    exploreTitle: {
      en: settings.explore_title_en,
      pt: settings.explore_title_pt,
    },
    maisonTitle: {
      en: settings.maison_title_en,
      pt: settings.maison_title_pt,
    },
    contactsTitle: {
      en: settings.contacts_title_en,
      pt: settings.contacts_title_pt,
    },
    socialsTitle: {
      en: settings.socials_title_en,
      pt: settings.socials_title_pt,
    },
    socialLinks: links.map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
    })),
  };
}
