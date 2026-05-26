import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

/** Bump when replacing favicon assets to bust browser/CDN caches after deploy. */
export const FAVICON_VERSION = "3";

const iconVersionQuery = `?v=${FAVICON_VERSION}`;

/** Single source of truth for tab/bookmark icons — do not add other icon URLs. */
export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: `/favicon.ico${iconVersionQuery}`, sizes: "any" },
    { url: `/icon.png${iconVersionQuery}`, type: "image/png", sizes: "32x32" },
  ],
  shortcut: `/favicon.ico${iconVersionQuery}`,
  apple: [
    {
      url: `/apple-icon.png${iconVersionQuery}`,
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

export const rootMetadata: Metadata = {
  title: {
    default: `${SITE.name} — Fine Jewelry`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  icons: siteIcons,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [
      {
        url: `/brand/og-icon.png${iconVersionQuery}`,
        width: 512,
        height: 512,
        alt: `${SITE.name} mark`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
    images: [`/brand/og-icon.png${iconVersionQuery}`],
  },
};

export function pageMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description: description ?? SITE.description,
  };
}
