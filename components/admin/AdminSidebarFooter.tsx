import { requireAdmin } from "@/lib/admin/auth";
import { AdminLogoutButton } from "@/components/admin/auth/AdminLogoutButton";

export async function AdminSidebarFooter() {
  const session = await requireAdmin();

  return (
    <div className="mt-auto border-t border-[var(--maison-hairline)] pt-6">
      <p className="truncate font-sans text-[0.75rem] text-[var(--maison-mist)]">
        {session.email}
      </p>
      <p className="mt-0.5 text-[0.6875rem] capitalize tracking-[0.06em] text-[var(--maison-mist)]">
        {session.role}
      </p>
      <AdminLogoutButton />
    </div>
  );
}
