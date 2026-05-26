import type { Metadata } from "next";
import { siteIcons } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
  icons: siteIcons,
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
