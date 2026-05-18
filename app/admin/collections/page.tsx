import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { listCollectionsAdmin } from "@/services/supabase/admin-read";

export default async function AdminCollectionsPage() {
  const collections = await listCollectionsAdmin();

  return (
    <AdminShell
      title="Collections"
      description="Seasonal edits and cover imagery."
      actions={
        <Link href={ADMIN_ROUTES.collectionNew}>
          <AdminButton variant="solid">New collection</AdminButton>
        </Link>
      }
    >
      <div className="admin-panel overflow-x-auto p-0">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Featured</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.id}>
                <td className="font-serif text-[0.9375rem]">{c.name}</td>
                <td className="text-[var(--maison-gray)]">{c.slug}</td>
                <td className="text-[var(--maison-mist)]">
                  {c.featured ? "Yes" : "—"}
                </td>
                <td className="text-right">
                  <Link
                    href={ADMIN_ROUTES.collection(c.id)}
                    className="text-[0.8125rem] text-[var(--maison-charcoal)] hover:opacity-60"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
