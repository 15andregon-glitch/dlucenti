import { EntryForm } from "@/components/admin/finance/EntryForm";
import { EntriesList } from "@/components/admin/finance/EntriesList";
import { FinanceEmptyState } from "@/components/admin/finance/FinanceEmptyState";
import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { FinancePageHeader } from "@/components/admin/finance/FinancePageHeader";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { loadFinancePage } from "@/lib/finance/load-finance-page";
import { getOrComputeIncomeStatement, listEntriesForPeriod } from "@/services/finance";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function FinanceRevenuePage({ searchParams }: PageProps) {
  const { period: periodParam } = await searchParams;
  const ctx = await loadFinancePage(periodParam);

  if (ctx.error) return <FinanceEmptyState error={ctx.error} />;
  if (!ctx.period) return <FinanceEmptyState />;

  const [entries, statement] = await Promise.all([
    listEntriesForPeriod(ctx.period.id),
    getOrComputeIncomeStatement(ctx.period.id),
  ]);

  const revenueEntries = entries.filter((e) => e.category?.group_type === "revenue");

  return (
    <>
      <FinancePageHeader periods={ctx.periods} periodId={ctx.period.id} />

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <FinanceMetricCard
          label="Total revenue"
          value={statement.metrics.totalRevenue}
          growth={statement.metrics.revenueGrowthPct}
        />
        <FinanceMetricCard
          label="Sales revenue"
          value={revenueEntries
            .filter((e) => e.category?.code === "sales_revenue")
            .reduce((s, e) => s + e.amount, 0)}
        />
        <FinanceMetricCard
          label="Service revenue"
          value={revenueEntries
            .filter((e) => e.category?.code === "service_revenue")
            .reduce((s, e) => s + e.amount, 0)}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <AdminPanel title="Revenue entries">
          <EntriesList
            entries={revenueEntries}
            periodId={ctx.period.id}
            emptyMessage="No revenue entries. Sync orders or add manual entries."
          />
        </AdminPanel>
        <EntryForm
          periods={ctx.periods}
          categories={ctx.categories}
          defaultPeriodId={ctx.period.id}
          filterGroup="revenue"
        />
      </div>
    </>
  );
}
