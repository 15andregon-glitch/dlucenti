"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import type { ReportingPeriod } from "@/types/finance";

const QUICK_RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "ytd", label: "Year to date" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" },
] as const;

const GRANULARITIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semester", label: "Semester" },
  { value: "yearly", label: "Yearly" },
] as const;

interface FinancePeriodFiltersProps {
  periods?: ReportingPeriod[];
  showAccountingPeriod?: boolean;
}

function FinancePeriodFiltersInner({
  periods = [],
  showAccountingPeriod = true,
}: FinancePeriodFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const range = searchParams.get("range") ?? "30d";
  const granularity = searchParams.get("granularity") ?? "monthly";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const periodId = searchParams.get("period") ?? periods[0]?.id ?? "";

  const pushParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <p className="admin-label mb-1.5">Period</p>
        <AdminSelect
          value={range}
          onChange={(e) => {
            const next = e.target.value;
            if (next !== "custom") {
              pushParams({ range: next, from: null, to: null });
            } else {
              pushParams({ range: "custom" });
            }
          }}
          className="min-w-[9rem]"
        >
          {QUICK_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      <div>
        <p className="admin-label mb-1.5">View</p>
        <AdminSelect
          value={granularity}
          onChange={(e) => pushParams({ granularity: e.target.value })}
          className="min-w-[8rem]"
        >
          {GRANULARITIES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      {range === "custom" && (
        <>
          <div>
            <p className="admin-label mb-1.5">From</p>
            <AdminInput
              type="date"
              value={from}
              onChange={(e) => pushParams({ from: e.target.value, range: "custom" })}
              className="w-[10.5rem]"
            />
          </div>
          <div>
            <p className="admin-label mb-1.5">To</p>
            <AdminInput
              type="date"
              value={to}
              onChange={(e) => pushParams({ to: e.target.value, range: "custom" })}
              className="w-[10.5rem]"
            />
          </div>
        </>
      )}

      {showAccountingPeriod && periods.length > 0 && (
        <div>
          <p className="admin-label mb-1.5">Accounting period</p>
          <AdminSelect
            value={periodId}
            onChange={(e) => pushParams({ period: e.target.value })}
            className="min-w-[11rem]"
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </AdminSelect>
        </div>
      )}
    </div>
  );
}

export function FinancePeriodFilters(props: FinancePeriodFiltersProps) {
  return (
    <Suspense fallback={<div className="h-9 w-64 bg-[var(--maison-champagne)]" />}>
      <FinancePeriodFiltersInner {...props} />
    </Suspense>
  );
}
