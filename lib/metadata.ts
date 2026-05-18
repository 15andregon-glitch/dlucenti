import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const rootMetadata: Metadata = {
  title: {
    default: `${SITE.name} — Fine Jewelry`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
};

export function pageMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description: description ?? SITE.description,
  };
}
