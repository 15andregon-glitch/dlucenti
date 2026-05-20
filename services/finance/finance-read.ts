import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRole } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildIncomeStatement } from "@/lib/finance/dr-engine";
import { isSeedFinancialEntry } from "@/lib/finance/business-mode";
import type {
  CostStructureItem,
  FinancialCategory,
  FinancialEntry,
  IncomeStatement,
  ReportingPeriod,
  TrendPoint,
} from "@/types/finance";
import {
  fetchDRSnapshot,
  fetchEntriesForPeriod,
  fetchEntriesForPeriods,
  fetchFinancialCategories,
  fetchReportingPeriodById,
  fetchReportingPeriods,
  upsertDRSnapshot,
} from "@/queries/finance";

async function financeClient() {
  if (hasSupabaseServiceRole()) return createSupabaseAdminClient();
  return createSupabaseServerClient();
}

function mapEntry(row: Record<string, unknown>): FinancialEntry {
  const cat = row.financial_categories as FinancialCategory | null;
  return {
    id: row.id as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    period_id: row.period_id as string,
    category_id: row.category_id as string,
    amount: Number(row.amount),
    currency: row.currency as string,
    source: row.source as FinancialEntry["source"],
    source_ref: row.source_ref as string | null,
    description: row.description as string | null,
    entry_date: row.entry_date as string,
    category: cat ?? undefined,
  };
}

export async function listReportingPeriods(year?: number): Promise<ReportingPeriod[]> {
  const client = await financeClient();
  const { data, error } = await fetchReportingPeriods(client, year);
  if (error) throw error;
  return (data ?? []) as ReportingPeriod[];
}

export async function getReportingPeriod(id: string): Promise<ReportingPeriod | null> {
  const client = await financeClient();
  const { data, error } = await fetchReportingPeriodById(client, id);
  if (error) throw error;
  return data as ReportingPeriod | null;
}

export async function listFinancialCategories(): Promise<FinancialCategory[]> {
  const client = await financeClient();
  const { data, error } = await fetchFinancialCategories(client);
  if (error) throw error;
  return (data ?? []) as FinancialCategory[];
}

export async function listEntriesForPeriod(periodId: string): Promise<FinancialEntry[]> {
  const client = await financeClient();
  const { data, error } = await fetchEntriesForPeriod(client, periodId);
  if (error) throw error;
  return (data ?? []).map((r) => mapEntry(r as Record<string, unknown>));
}

export async function computeIncomeStatement(
  periodId: string,
  persist = true,
): Promise<IncomeStatement> {
  const client = await financeClient();
  const period = await getReportingPeriod(periodId);
  if (!period) throw new Error("Period not found");

  const [{ data: categories }, { data: entries }] = await Promise.all([
    fetchFinancialCategories(client),
    fetchEntriesForPeriod(client, periodId),
  ]);

  const cats = (categories ?? []) as FinancialCategory[];
  const mapped = (entries ?? [])
    .map((r) => mapEntry(r as Record<string, unknown>))
    .filter((e) => !isSeedFinancialEntry(e.description));

  const periods = await listReportingPeriods(period.year);
  const monthly = periods
    .filter((p) => p.period_type === "month" && p.month)
    .sort((a, b) => (a.month ?? 0) - (b.month ?? 0));
  const idx = monthly.findIndex((p) => p.id === periodId);
  let previousRevenue: number | undefined;
  if (idx > 0) {
    const prev = monthly[idx - 1];
    const prevEntries = await listEntriesForPeriod(prev.id);
    previousRevenue = buildIncomeStatement(prev, prevEntries, cats).metrics.totalRevenue;
  }

  const statement = buildIncomeStatement(period, mapped, cats, previousRevenue);

  if (persist) {
    await upsertDRSnapshot(client, periodId, statement);
  }

  return statement;
}

export async function getOrComputeIncomeStatement(
  periodId: string,
): Promise<IncomeStatement> {
  const client = await financeClient();
  const { data: snap } = await fetchDRSnapshot(client, periodId);
  if (snap?.snapshot) {
    return snap.snapshot as IncomeStatement;
  }
  return computeIncomeStatement(periodId, true);
}

export async function getFinanceTrends(months = 12): Promise<TrendPoint[]> {
  const periods = await listReportingPeriods();
  const monthly = periods
    .filter((p) => p.period_type === "month")
    .slice(0, months)
    .reverse();

  const points: TrendPoint[] = [];
  for (const period of monthly) {
    const stmt = await getOrComputeIncomeStatement(period.id);
    points.push({
      label: period.label,
      periodId: period.id,
      revenue: stmt.metrics.totalRevenue,
      ebitda: stmt.metrics.ebitda,
      netIncome: stmt.metrics.netIncome,
      grossMarginPct: stmt.metrics.grossMarginPct,
    });
  }
  return points;
}

export async function getCostStructure(periodId: string): Promise<CostStructureItem[]> {
  const entries = await listEntriesForPeriod(periodId);
  const categories = await listFinancialCategories();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const expenseGroups = new Map<string, number>();
  let total = 0;

  for (const e of entries) {
    const cat = catMap.get(e.category_id);
    if (!cat || cat.group_type === "revenue") continue;
    const key = cat.group_type;
    expenseGroups.set(key, (expenseGroups.get(key) ?? 0) + Number(e.amount));
    total += Number(e.amount);
  }

  const labels: Record<string, string> = {
    variable_cost: "Custos variáveis",
    fixed_cost: "Custos fixos",
    depreciation: "Depreciação",
    financial: "Financeiro",
    extraordinary: "Extraordinário",
  };

  return [...expenseGroups.entries()].map(([group, amount]) => ({
    label: labels[group] ?? group,
    group: group as CostStructureItem["group"],
    amount,
    pct: total > 0 ? (amount / total) * 100 : 0,
  }));
}

export async function getYearlyDR(year: number): Promise<IncomeStatement[]> {
  const periods = (await listReportingPeriods(year)).filter(
    (p) => p.period_type === "month",
  );
  const results: IncomeStatement[] = [];
  for (const p of periods) {
    results.push(await getOrComputeIncomeStatement(p.id));
  }
  return results;
}

export async function aggregateYearEntries(year: number): Promise<FinancialEntry[]> {
  const client = await financeClient();
  const periods = (await listReportingPeriods(year)).filter(
    (p) => p.period_type === "month",
  );
  const ids = periods.map((p) => p.id);
  const { data, error } = await fetchEntriesForPeriods(client, ids);
  if (error) throw error;
  return (data ?? []).map((r) => mapEntry(r as Record<string, unknown>));
}
