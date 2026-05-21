import type { FooterContent } from "@/types/footer";

/** Storefront fallback when Supabase is not configured */
export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  contactEmail: "hello@dlucenti.com",
  slogan: {
    en: "Contemporary minimalism shaped by tradition.",
    pt: "Minimalismo contemporâneo, moldado pela tradição.",
  },
  location: {
    en: "Portugal",
    pt: "Portugal",
  },
  exploreTitle: {
    en: "Explore",
    pt: "Explorar",
  },
  maisonTitle: {
    en: "House",
    pt: "A Casa",
  },
  contactsTitle: {
    en: "Contacts",
    pt: "Contactos",
  },
  socialsTitle: {
    en: "Socials",
    pt: "Redes sociais",
  },
  socialLinks: [
    { id: "instagram", label: "Instagram", url: "https://instagram.com/" },
    { id: "pinterest", label: "Pinterest", url: "https://pinterest.com/" },
    { id: "tiktok", label: "TikTok", url: "https://tiktok.com/" },
  ],
};
