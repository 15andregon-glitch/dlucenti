"use client";

import {
  computeProductEconomics,
  getProductFinanceWarnings,
  type ProductEconomicsInput,
} from "@/lib/finance/product-economics";
import { formatCurrencyDetailed } from "@/lib/finance/format";
import { cn } from "@/lib/cn";

interface ProductFinanceSummaryProps {
  input: ProductEconomicsInput;
  stock?: number;
  minimumStock?: number;
}

export function ProductFinanceSummary({
  input,
  stock = 0,
  minimumStock = 0,
}: ProductFinanceSummaryProps) {
  const economics = computeProductEconomics(input);
  const warnings = getProductFinanceWarnings(input, economics, {
    stock,
    minimumStock,
    targetMarginPercent: input.targetMarginPercent,
  });

  const rows = [
    { label: "Total unit cost", value: formatCurrencyDetailed(economics.totalCost) },
    { label: "Gross profit", value: formatCurrencyDetailed(economics.grossProfit) },
    {
      label: "Gross margin",
      value: `${economics.grossMarginPercent.toFixed(1)}%`,
    },
    { label: "Markup", value: economics.markup > 0 ? `${economics.markup.toFixed(2)}×` : "—" },
    { label: "Payment fees (est.)", value: formatCurrencyDetailed(economics.paymentFees) },
    { label: "VAT (est.)", value: formatCurrencyDetailed(economics.vatAmount) },
    { label: "Est. net profit", value: formatCurrencyDetailed(economics.estimatedNetProfit) },
  ];

  return (
    <aside className="sticky top-8 border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] p-6 md:p-8">
      <p className="admin-label mb-6">Unit economics</p>
      <dl className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-[var(--maison-hairline)] pb-3 last:border-0 last:pb-0"
          >
            <dt className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
              {row.label}
            </dt>
            <dd className="font-sans text-[0.8125rem] tabular-nums text-[var(--maison-charcoal)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {warnings.length > 0 && (
        <ul className="mt-8 space-y-3 border-t border-[var(--maison-hairline)] pt-6">
          {warnings.map((w) => (
            <li
              key={w.id}
              className={cn(
                "rounded-sm border px-3 py-2.5",
                w.severity === "critical" &&
                  "border-[rgba(58,56,52,0.2)] bg-[var(--maison-beige)]",
                w.severity === "warning" &&
                  "border-[var(--maison-hairline-strong)] bg-[var(--maison-surface-soft)]",
                w.severity === "info" &&
                  "border-[var(--maison-hairline)] bg-transparent",
              )}
            >
              <p className="font-sans text-[0.6875rem] tracking-[0.08em] text-[var(--maison-gray)] uppercase">
                {w.title}
              </p>
              <p className="mt-1 font-sans text-[0.75rem] leading-relaxed text-[var(--maison-charcoal)]">
                {w.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
