import { formatCurrency, formatPercent } from "@/lib/finance/format";
import type { DRLineItem, IncomeStatementMetrics } from "@/types/finance";
import { cn } from "@/lib/cn";

interface DRTableProps {
  lines: DRLineItem[];
  metrics: IncomeStatementMetrics;
}

export function DRTable({ lines, metrics }: DRTableProps) {
  return (
    <div className="admin-panel overflow-x-auto p-0">
      <table className="admin-table w-full">
        <thead>
          <tr>
            <th className="w-[55%]">Demonstração de resultados</th>
            <th className="text-right">Valor</th>
            <th className="text-right">% receitas</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr
              key={line.code}
              className={cn(
                line.isHeader && "bg-[var(--maison-surface-soft)]",
                line.isSubtotal && "font-medium",
              )}
            >
              <td
                className={cn(
                  "font-sans",
                  line.indent && "pl-8",
                  line.isHeader && "text-[0.6875rem] uppercase tracking-[0.1em] text-[var(--maison-mist)]",
                  line.isSubtotal && "font-sans font-extralight text-[0.9375rem]",
                  !line.isHeader && !line.isSubtotal && "text-[0.8125rem] text-[var(--maison-gray)]",
                )}
              >
                {line.label}
              </td>
              <td
                className={cn(
                  "text-right tabular-nums",
                  line.isSubtotal && "font-sans font-extralight text-[0.9375rem] text-[var(--maison-charcoal)]",
                  !line.isSubtotal && !line.isHeader && "text-[0.8125rem]",
                  line.isHeader && "text-transparent",
                )}
              >
                {line.isHeader ? "—" : formatCurrency(Math.abs(line.amount))}
              </td>
              <td className="text-right font-sans text-[0.75rem] tabular-nums text-[var(--maison-mist)]">
                {line.isHeader || line.isSubtotal
                  ? line.isSubtotal
                    ? formatPercent(
                        metrics.totalRevenue
                          ? (line.amount / metrics.totalRevenue) * 100
                          : 0,
                      )
                    : "—"
                  : formatPercent(
                      metrics.totalRevenue
                        ? (Math.abs(line.amount) / metrics.totalRevenue) * 100
                        : 0,
                    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
