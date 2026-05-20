import { formatCurrency, formatPercent, formatGrowth } from "@/lib/finance/format";
import { cn } from "@/lib/cn";

interface FinanceMetricCardProps {
  label: string;
  value: number;
  format?: "currency" | "percent" | "number";
  growth?: number | null;
  className?: string;
}

export function FinanceMetricCard({
  label,
  value,
  format = "currency",
  growth,
  className,
}: FinanceMetricCardProps) {
  const display =
    format === "percent"
      ? formatPercent(value)
      : format === "number"
        ? value.toLocaleString("fr-FR")
        : formatCurrency(value);

  return (
    <div className={cn("admin-panel", className)}>
      <p className="admin-label">{label}</p>
      <p className="mt-3 font-sans font-extralight text-[1.75rem] tabular-nums leading-none text-[var(--maison-charcoal)]">
        {display}
      </p>
      {growth !== undefined && (
        <p className="mt-2 font-sans text-[0.75rem] text-[var(--maison-mist)]">
          {formatGrowth(growth)} vs prior period
        </p>
      )}
    </div>
  );
}
