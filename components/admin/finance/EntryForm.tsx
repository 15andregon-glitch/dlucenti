"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFinancialEntryAction } from "@/lib/admin/actions/finance";
import type { FinancialCategory, ReportingPeriod } from "@/types/finance";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";

interface EntryFormProps {
  periods: ReportingPeriod[];
  categories: FinancialCategory[];
  defaultPeriodId?: string;
  filterGroup?: FinancialCategory["group_type"];
}

export function EntryForm({
  periods,
  categories,
  defaultPeriodId,
  filterGroup,
}: EntryFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const filtered = filterGroup
    ? categories.filter((c) => c.group_type === filterGroup)
    : categories;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createFinancialEntryAction(formData);
      if (!result.ok) alert(result.error);
      else router.refresh();
    });
  };

  return (
    <AdminPanel title="New entry">
      <form action={handleSubmit} className="grid max-w-md gap-6">
        <AdminField label="Period" htmlFor="period_id">
          <AdminSelect
            id="period_id"
            name="period_id"
            defaultValue={defaultPeriodId ?? periods[0]?.id}
            required
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Category" htmlFor="category_id">
          <AdminSelect id="category_id" name="category_id" required>
            {filtered.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_pt || c.name}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Amount (EUR)" htmlFor="amount">
          <AdminInput id="amount" name="amount" type="number" min={0} step="0.01" required />
        </AdminField>
        <AdminField label="Date" htmlFor="entry_date">
          <AdminInput
            id="entry_date"
            name="entry_date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </AdminField>
        <AdminField label="Note" htmlFor="description">
          <AdminTextarea id="description" name="description" rows={2} />
        </AdminField>
        <button type="submit" className="admin-btn admin-btn--solid w-fit" disabled={pending}>
          {pending ? "Saving…" : "Add entry"}
        </button>
      </form>
    </AdminPanel>
  );
}
