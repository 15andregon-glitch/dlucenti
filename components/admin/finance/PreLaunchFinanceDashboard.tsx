import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import type { PreLaunchOperationalMetrics } from "@/services/finance/business-mode";

interface PreLaunchFinanceDashboardProps {
  metrics: PreLaunchOperationalMetrics;
}

export function PreLaunchFinanceDashboard({ metrics }: PreLaunchFinanceDashboardProps) {
  return (
    <div className="space-y-10">
      <AdminPanel title="Pre-launch mode">
        <p className="max-w-2xl font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
          The business is currently in pre-launch mode. No sales have been recorded yet —
          financial analytics will appear after the first orders. Below are operational metrics
          derived from your catalog and inventory.
        </p>
      </AdminPanel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FinanceMetricCard label="Products in catalog" value={metrics.totalProducts} format="number" />
        <FinanceMetricCard
          label="Inventory units"
          value={metrics.totalStockUnits}
          format="number"
        />
        <FinanceMetricCard
          label="Inventory value (retail)"
          value={metrics.inventoryValue}
        />
        <FinanceMetricCard label="Inventory cost" value={metrics.inventoryCost} />
        <FinanceMetricCard
          label="Est. potential gross profit"
          value={metrics.potentialGrossProfit}
        />
        <FinanceMetricCard
          label="Avg. theoretical margin"
          value={metrics.averageMarginPercent}
          format="percent"
        />
      </div>

      <AdminPanel title="No sales yet">
        <ul className="space-y-3 font-sans text-[0.8125rem] text-[var(--maison-gray)]">
          <li>Financial analytics will appear after the first orders.</li>
          <li>Add products with complete pricing and cost data to begin operations.</li>
          <li>Do not use demo seed data — it will not reflect your real business.</li>
        </ul>
      </AdminPanel>
    </div>
  );
}
