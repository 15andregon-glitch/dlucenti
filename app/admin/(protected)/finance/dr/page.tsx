import { DRTable } from "@/components/admin/finance/DRTable";
import { FinanceEmptyState } from "@/components/admin/finance/FinanceEmptyState";
import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { FinancePageHeader } from "@/components/admin/finance/FinancePageHeader";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { loadFinancePage } from "@/lib/finance/load-finance-page";
import { getOrComputeIncomeStatement } from "@/services/finance";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function FinanceDRPage({ searchParams }: PageProps) {
  const { period: periodParam } = await searchParams;
  const ctx = await loadFinancePage(periodParam);

  if (ctx.error) return <FinanceEmptyState error={ctx.error} />;
  if (!ctx.period) return <FinanceEmptyState />;

  const statement = await getOrComputeIncomeStatement(ctx.period.id);
  const m = statement.metrics;

  return (
    <>
      <FinancePageHeader periods={ctx.periods} periodId={ctx.period.id} />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FinanceMetricCard label="Gross margin" value={m.grossMargin} />
        <FinanceMetricCard label="EBITDA" value={m.ebitda} />
        <FinanceMetricCard label="EBIT" value={m.ebit} />
        <FinanceMetricCard label="Financial result" value={m.financialResult} />
        <FinanceMetricCard label="Net income" value={m.netIncome} growth={m.revenueGrowthPct} />
      </div>

      <AdminPanel title={`Demonstração de resultados — ${ctx.period.label}`}>
        <DRTable lines={statement.lines} metrics={m} />
        <p className="mt-6 font-sans text-[0.6875rem] text-[var(--maison-mist)]">
          Computed {new Date(statement.computedAt).toLocaleString("en-GB")}
        </p>
      </AdminPanel>
    </>
  );
}
