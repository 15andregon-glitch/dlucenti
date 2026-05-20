import { formatCurrency } from "@/lib/finance/format";
import { cn } from "@/lib/cn";

interface FinanceBarChartProps {
  data: { label: string; value: number }[];
  className?: string;
  maxBars?: number;
}

export function FinanceBarChart({
  data,
  className,
  maxBars = 12,
}: FinanceBarChartProps) {
  const slice = data.slice(-maxBars);
  const max = Math.max(...slice.map((d) => d.value), 1);

  return (
    <div className={cn("space-y-4", className)}>
      {slice.map((d) => (
        <div
          key={d.label}
          className="grid grid-cols-[5rem_1fr_5rem] items-center gap-4"
        >
          <span className="truncate font-sans text-[0.6875rem] text-[var(--maison-mist)]">
            {d.label}
          </span>
          <div className="h-1.5 overflow-hidden bg-[var(--maison-champagne)]">
            <div
              className="h-full bg-[var(--maison-charcoal)] transition-all duration-700 ease-[var(--ease-maison)]"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-right font-sans text-[0.6875rem] tabular-nums text-[var(--maison-gray)]">
            {formatCurrency(d.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
