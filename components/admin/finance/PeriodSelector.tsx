"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReportingPeriod } from "@/types/finance";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";

interface PeriodSelectorProps {
  periods: ReportingPeriod[];
  paramKey?: string;
}

export function PeriodSelector({ periods, paramKey = "period" }: PeriodSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? periods[0]?.id ?? "";

  return (
    <AdminSelect
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramKey, e.target.value);
        router.push(`?${params.toString()}`);
      }}
      className="max-w-[14rem]"
    >
      {periods.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </AdminSelect>
  );
}
