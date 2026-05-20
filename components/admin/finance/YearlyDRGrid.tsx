import { formatCurrency, formatPercent } from "@/lib/finance/format";
import type { IncomeStatement } from "@/types/finance";

interface YearlyDRGridProps {
  statements: IncomeStatement[];
}

export function YearlyDRGrid({ statements }: YearlyDRGridProps) {
  if (!statements.length) {
    return (
      <p className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
        No monthly statements for this year.
      </p>
    );
  }

  return (
    <div className="admin-panel overflow-x-auto p-0">
      <table className="admin-table w-full">
        <thead>
          <tr>
            <th>Period</th>
            <th className="text-right">Revenue</th>
            <th className="text-right">EBITDA</th>
            <th className="text-right">Net income</th>
            <th className="text-right">Gross margin</th>
            <th className="text-right">Net margin</th>
          </tr>
        </thead>
        <tbody>
          {statements.map((s) => (
            <tr key={s.period.id}>
              <td className="font-sans font-extralight text-[0.875rem]">{s.period.label}</td>
              <td className="text-right tabular-nums">{formatCurrency(s.metrics.totalRevenue)}</td>
              <td className="text-right tabular-nums">{formatCurrency(s.metrics.ebitda)}</td>
              <td className="text-right tabular-nums">{formatCurrency(s.metrics.netIncome)}</td>
              <td className="text-right tabular-nums">
                {formatPercent(s.metrics.grossMarginPct)}
              </td>
              <td className="text-right tabular-nums">
                {formatPercent(s.metrics.netMarginPct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
