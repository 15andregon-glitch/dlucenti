import { AdminPanel } from "@/components/admin/ui/AdminPanel";

export function FinanceNoSalesState() {
  return (
    <AdminPanel title="No sales yet">
      <p className="font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
        Financial analytics will appear after the first orders. Revenue charts, growth
        percentages, and profit KPIs are hidden until real sales exist.
      </p>
      <p className="mt-4 font-sans text-[0.75rem] text-[var(--maison-mist)]">
        Add products with selling price and unit cost, then complete checkout when orders go
        live.
      </p>
    </AdminPanel>
  );
}
