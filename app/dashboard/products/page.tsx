import { DashboardShell } from "@/dashboard/components/DashboardShell";
import { getProducts } from "@/services/products";

export default async function DashboardProductsPage() {
  const products = await getProducts();

  return (
    <DashboardShell title="Products" description="Manage catalog pieces">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-500">Name</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Category</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 capitalize text-neutral-500">{p.category}</td>
                <td className="px-4 py-3">
                  {p.price.toLocaleString("fr-FR")} {p.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
