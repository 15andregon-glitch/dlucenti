import { resolveReportingPeriod } from "@/lib/finance/resolve-period";
import {
  listFinancialCategories,
  listReportingPeriods,
} from "@/services/finance";
import type { FinancialCategory, ReportingPeriod } from "@/types/finance";

export interface FinancePageContext {
  periods: ReportingPeriod[];
  period: ReportingPeriod | null;
  categories: FinancialCategory[];
  error: string | null;
}

export async function loadFinancePage(
  periodParam?: string | null,
): Promise<FinancePageContext> {
  try {
    const [periods, categories] = await Promise.all([
      listReportingPeriods(),
      listFinancialCategories(),
    ]);
    return {
      periods,
      categories,
      period: resolveReportingPeriod(periods, periodParam),
      error: null,
    };
  } catch (e) {
    return {
      periods: [],
      categories: [],
      period: null,
      error: e instanceof Error ? e.message : "Unable to load finance data",
    };
  }
}
