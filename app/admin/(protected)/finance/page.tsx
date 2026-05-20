import Link from "next/link";
import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { FinanceBarChart } from "@/components/admin/finance/FinanceBarChart";
import { FinanceEmptyState } from "@/components/admin/finance/FinanceEmptyState";
import { FinancePageHeader } from "@/components/admin/finance/FinancePageHeader";
import { PreLaunchFinanceDashboard } from "@/components/admin/finance/PreLaunchFinanceDashboard";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { loadFinancePage } from "@/lib/finance/load-finance-page";
import { resolveFinanceDateRange } from "@/lib/finance/date-range";
import {
  getBusinessModeSnapshot,
  getPreLaunchOperationalMetrics,
} from "@/services/finance/business-mode";
import {
  getCostStructure,
  getFinanceTrends,
  getOrComputeIncomeStatement,
} from "@/services/finance";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    period?: string;
    range?: string;
    from?: string;
    to?: string;
    granularity?: string;
  }>;
}

export default async function FinanceOverviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dateRange = resolveFinanceDateRange(params);
  const [ctx, business] = await Promise.all([
    loadFinancePage(params.period),
    getBusinessModeSnapshot(),
  ]);

  if (ctx.error) return <FinanceEmptyState error={ctx.error} />;

  const preLaunchMetrics = await getPreLaunchOperationalMetrics();

  if (business.mode === "pre_launch") {
    return (
      <>
        <FinancePageHeader
          periods={ctx.periods}
          periodId={ctx.period?.id ?? ""}
          showToolbar={false}
          dateRangeLabel={dateRange.label}
        />
        {business.hasSeedEntriesOnly && (
          <AdminPanel className="mb-8" title="Demo data detected">
            <p className="font-sans text-[0.8125rem] text-[var(--maison-gray)]">
              Seed financial entries were found but no real orders exist. Remove entries with
              descriptions starting with{" "}
              <code className="text-[var(--maison-charcoal)]">seed:</code> in Supabase to avoid
              misleading analytics after launch.
            </p>
          </AdminPanel>
        )}
        <PreLaunchFinanceDashboard metrics={preLaunchMetrics} />
        <div className="mt-10 flex flex-wrap gap-6">
          <QuickLink href={ADMIN_ROUTES.products} label="Manage products" />
          {!ctx.period && (
            <span className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
              Create a reporting period when you begin manual cost tracking.
            </span>
          )}
        </div>
      </>
    );
  }

  if (!ctx.period) return <FinanceEmptyState />;

  const [statement, trends, costStructure] = await Promise.all([
    getOrComputeIncomeStatement(ctx.period.id),
    getFinanceTrends(6),
    getCostStructure(ctx.period.id),
  ]);

  const m = statement.metrics;
  const hasRevenue = m.totalRevenue > 0;

  return (
    <>
      <FinancePageHeader
        periods={ctx.periods}
        periodId={ctx.period.id}
        dateRangeLabel={dateRange.label}
      />

      {!hasRevenue ? (
        <AdminPanel className="mb-8" title="Awaiting revenue">
          <p className="font-sans text-[0.8125rem] text-[var(--maison-gray)]">
            Active business mode is on, but no revenue is recorded for this period. Charts and
            growth metrics appear once orders sync or revenue entries are added.
          </p>
        </AdminPanel>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FinanceMetricCard
              label="Revenue"
              value={m.totalRevenue}
              growth={m.revenueGrowthPct}
            />
            <FinanceMetricCard label="EBITDA" value={m.ebitda} />
            <FinanceMetricCard label="Net income" value={m.netIncome} />
            <FinanceMetricCard
              label="Gross margin"
              value={m.grossMarginPct}
              format="percent"
            />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <AdminPanel title={`Revenue trend · ${dateRange.label}`}>
              {trends.some((t) => t.revenue > 0) ? (
                <FinanceBarChart
                  data={trends.map((t) => ({
                    label: t.label.split(" ")[0] ?? t.label,
                    value: t.revenue,
                  }))}
                />
              ) : (
                <p className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
                  No sales yet. Revenue trend will populate after orders are recorded.
                </p>
              )}
            </AdminPanel>
            <AdminPanel title="Cost structure">
              {costStructure.length > 0 ? (
                <FinanceBarChart
                  data={costStructure.map((i) => ({ label: i.label, value: i.amount }))}
                />
              ) : (
                <p className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
                  No costs recorded yet.
                </p>
              )}
            </AdminPanel>
          </div>
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-6">
        <QuickLink href={ADMIN_ROUTES.financeDr} label="Income statement (DR)" />
        <QuickLink href={ADMIN_ROUTES.financeAnalytics} label="Analytics" />
        <QuickLink href={ADMIN_ROUTES.financeRevenue} label="Revenue entries" />
        <QuickLink href={ADMIN_ROUTES.financeCosts} label="Cost entries" />
      </div>
    </>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-sans text-[0.8125rem] text-[var(--maison-gray)] underline-offset-4 hover:text-[var(--maison-charcoal)] hover:underline"
    >
      {label} →
    </Link>
  );
}
