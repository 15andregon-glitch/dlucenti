import type { Metadata } from "next";
import "@/styles/admin.css";
import { AdminConfigBanner } from "@/components/admin/AdminConfigBanner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "CMS",
    template: "%s · CMS · Maison Aurélie",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminConfigBanner />
      {children}
    </>
  );
}
