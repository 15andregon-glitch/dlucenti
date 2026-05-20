import type { ReportingPeriod } from "@/types/finance";

export function resolveReportingPeriod(
  periods: ReportingPeriod[],
  periodId?: string | null,
): ReportingPeriod | null {
  if (!periods.length) return null;
  if (periodId) {
    const match = periods.find((p) => p.id === periodId);
    if (match) return match;
  }
  const monthly = periods
    .filter((p) => p.period_type === "month")
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return (b.month ?? 0) - (a.month ?? 0);
    });
  return monthly[0] ?? periods[0];
}
