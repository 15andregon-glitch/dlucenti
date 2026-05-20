import { CostStructure } from "@/components/admin/finance/CostStructure";
import { EntryForm } from "@/components/admin/finance/EntryForm";
import { EntriesList } from "@/components/admin/finance/EntriesList";
import { FinanceEmptyState } from "@/components/admin/finance/FinanceEmptyState";
import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { FinancePageHeader } from "@/components/admin/finance/FinancePageHeader";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { loadFinancePage } from "@/lib/finance/load-finance-page";
import {
  getCostStructure,
  getOrComputeIncomeStatement,
  listEntriesForPeriod,
} from "@/services/finance";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function FinanceCostsPage({ searchParams }: PageProps) {
  const { period: periodParam } = await searchParams;
  const ctx = await loadFinancePage(periodParam);

  if (ctx.error) return <FinanceEmptyState error={ctx.error} />;
  if (!ctx.period) return <FinanceEmptyState />;

  const costGroups = new Set([
    "variable_cost",
    "fixed_cost",
    "depreciation",
    "financial",
    "extraordinary",
  ]);

  const [entries, statement, costStructure] = await Promise.all([
    listEntriesForPeriod(ctx.period.id),
    getOrComputeIncomeStatement(ctx.period.id),
    getCostStructure(ctx.period.id),
  ]);

  const costEntries = entries.filter((e) => e.category && costGroups.has(e.category.group_type));
  const m = statement.metrics;

  return (
    <>
      <FinancePageHeader periods={ctx.periods} periodId={ctx.period.id} />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FinanceMetricCard label="Variable costs" value={m.totalVariableCosts} />
        <FinanceMetricCard label="Fixed costs" value={m.totalFixedCosts} />
        <FinanceMetricCard label="D&A" value={m.totalDepreciation} />
        <FinanceMetricCard label="Gross margin %" value={m.grossMarginPct} format="percent" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <AdminPanel title="Cost entries">
            <EntriesList
              entries={costEntries}
              periodId={ctx.period.id}
              emptyMessage="No cost entries yet."
            />
          </AdminPanel>
          <AdminPanel title="Cost structure">
            <CostStructure items={costStructure} />
          </AdminPanel>
        </div>
        <EntryForm
          periods={ctx.periods}
          categories={ctx.categories.filter((c) => costGroups.has(c.group_type))}
          defaultPeriodId={ctx.period.id}
        />
      </div>
    </>
  );
}
