import { FinanceBarChart } from "@/components/admin/finance/FinanceBarChart";
import { FinanceEmptyState } from "@/components/admin/finance/FinanceEmptyState";
import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { FinancePageHeader } from "@/components/admin/finance/FinancePageHeader";
import { YearlyDRGrid } from "@/components/admin/finance/YearlyDRGrid";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { loadFinancePage } from "@/lib/finance/load-finance-page";
import {
  getFinanceTrends,
  getOrComputeIncomeStatement,
  getYearlyDR,
} from "@/services/finance";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string; year?: string }>;
}

export default async function FinanceAnalyticsPage({ searchParams }: PageProps) {
  const { period: periodParam, year: yearParam } = await searchParams;
  const ctx = await loadFinancePage(periodParam);

  if (ctx.error) return <FinanceEmptyState error={ctx.error} />;
  if (!ctx.period) return <FinanceEmptyState />;

  const year = yearParam ? Number(yearParam) : ctx.period.year;
  const [statement, trends, yearly] = await Promise.all([
    getOrComputeIncomeStatement(ctx.period.id),
    getFinanceTrends(12),
    getYearlyDR(year),
  ]);

  const m = statement.metrics;
  const yearlyTotals = yearly.reduce(
    (acc, s) => ({
      revenue: acc.revenue + s.metrics.totalRevenue,
      ebitda: acc.ebitda + s.metrics.ebitda,
      net: acc.net + s.metrics.netIncome,
    }),
    { revenue: 0, ebitda: 0, net: 0 },
  );

  return (
    <>
      <FinancePageHeader periods={ctx.periods} periodId={ctx.period.id} showToolbar={false} />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FinanceMetricCard label="Period revenue" value={m.totalRevenue} growth={m.revenueGrowthPct} />
        <FinanceMetricCard label="EBITDA margin" value={m.ebitdaMarginPct} format="percent" />
        <FinanceMetricCard label="Net margin" value={m.netMarginPct} format="percent" />
        <FinanceMetricCard label={`${year} revenue (YTD)`} value={yearlyTotals.revenue} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AdminPanel title="Revenue trend (12 months)">
          <FinanceBarChart data={trends.map((t) => ({ label: t.label, value: t.revenue }))} />
        </AdminPanel>
        <AdminPanel title="EBITDA trend">
          <FinanceBarChart data={trends.map((t) => ({ label: t.label, value: t.ebitda }))} />
        </AdminPanel>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <AdminPanel title="Net income trend">
          <FinanceBarChart data={trends.map((t) => ({ label: t.label, value: t.netIncome }))} />
        </AdminPanel>
        <AdminPanel title="Gross margin %">
          <FinanceBarChart
            data={trends.map((t) => ({
              label: t.label,
              value: Math.round(t.grossMarginPct),
            }))}
          />
        </AdminPanel>
      </div>

      <AdminPanel title={`Yearly DR — ${year}`} className="mt-10">
        <YearlyDRGrid statements={yearly} />
      </AdminPanel>
    </>
  );
}
