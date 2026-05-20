import { requireAdmin } from "@/lib/admin/auth";
import { AdminConfigBanner } from "@/components/admin/AdminConfigBanner";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <AdminConfigBanner />
      {children}
    </>
  );
}
