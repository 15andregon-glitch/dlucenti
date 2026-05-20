import type { Metadata } from "next";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: {
    default: "CMS",
    template: "%s · CMS · Maison Aurélie",
  },
  robots: { index: false, follow: false },
};

/** Root admin layout — auth split between /admin/login and (protected) */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
