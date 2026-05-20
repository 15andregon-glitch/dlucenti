import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { listProductsAdmin } from "@/services/supabase/admin-read";

export default async function AdminProductsPage() {
  const products = await listProductsAdmin();

  return (
    <AdminShell
      title="Products"
      description="Create and edit catalog pieces."
      actions={
        <Link href={ADMIN_ROUTES.productNew}>
          <AdminButton variant="solid">New product</AdminButton>
        </Link>
      }
    >
      <div className="admin-panel overflow-x-auto p-0">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="font-sans font-extralight text-[0.9375rem]">{p.name}</td>
                <td className="capitalize text-[var(--maison-gray)]">{p.category}</td>
                <td className="tabular-nums">
                  {Number(p.price).toLocaleString("fr-FR")} EUR
                </td>
                <td className="text-[var(--maison-mist)]">
                  {p.active ? "Active" : "Hidden"}
                  {p.featured ? " · Featured" : ""}
                </td>
                <td className="text-right">
                  <Link
                    href={ADMIN_ROUTES.product(p.id)}
                    className="text-[0.8125rem] text-[var(--maison-charcoal)] hover:opacity-60"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-[0.8125rem] text-[var(--maison-mist)]">
            No products yet.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
