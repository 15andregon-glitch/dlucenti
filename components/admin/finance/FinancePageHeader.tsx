import type { ReportingPeriod } from "@/types/finance";
import { FinancePeriodFilters } from "@/components/admin/finance/FinancePeriodFilters";
import { FinanceToolbar } from "@/components/admin/finance/FinanceToolbar";

interface FinancePageHeaderProps {
  periods: ReportingPeriod[];
  periodId: string;
  showToolbar?: boolean;
  dateRangeLabel?: string;
}

export function FinancePageHeader({
  periods,
  periodId,
  showToolbar = true,
  dateRangeLabel,
}: FinancePageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <FinancePeriodFilters periods={periods} />
        {dateRangeLabel && (
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">{dateRangeLabel}</p>
        )}
      </div>
      {showToolbar && periodId ? <FinanceToolbar periodId={periodId} /> : null}
    </div>
  );
}
