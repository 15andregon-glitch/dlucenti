import { formatCurrency, formatPercent } from "@/lib/finance/format";
import type { CostStructureItem } from "@/types/finance";
import { cn } from "@/lib/cn";

interface CostStructureProps {
  items: CostStructureItem[];
  className?: string;
}

export function CostStructure({ items, className }: CostStructureProps) {
  const max = Math.max(...items.map((i) => i.amount), 1);

  return (
    <div className={cn("space-y-5", className)}>
      {items.length === 0 ? (
        <p className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
          No cost data for this period.
        </p>
      ) : (
        items.map((item) => (
          <div key={item.group} className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-sans text-[0.8125rem] text-[var(--maison-gray)]">
                {item.label}
              </span>
              <span className="shrink-0 font-sans text-[0.75rem] tabular-nums text-[var(--maison-mist)]">
                {formatPercent(item.pct)}
              </span>
            </div>
            <div className="h-2 overflow-hidden bg-[var(--maison-champagne)]">
              <div
                className="h-full bg-[var(--maison-gold-muted)] transition-all duration-700"
                style={{ width: `${(item.amount / max) * 100}%` }}
              />
            </div>
            <p className="font-sans text-[0.6875rem] tabular-nums text-[var(--maison-mist)]">
              {formatCurrency(item.amount)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
