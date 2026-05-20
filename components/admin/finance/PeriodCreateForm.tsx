"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createReportingPeriodAction } from "@/lib/admin/actions/finance";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export function PeriodCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const now = new Date();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createReportingPeriodAction(formData);
      if (!result.ok) alert(result.error);
      else router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-wrap items-end gap-4">
      <AdminField label="Year" htmlFor="year">
        <AdminInput
          id="year"
          name="year"
          type="number"
          defaultValue={now.getFullYear()}
          min={2020}
          max={2100}
          required
          className="w-24"
        />
      </AdminField>
      <AdminField label="Month" htmlFor="month">
        <AdminInput
          id="month"
          name="month"
          type="number"
          defaultValue={now.getMonth() + 1}
          min={1}
          max={12}
          required
          className="w-20"
        />
      </AdminField>
      <AdminButton type="submit" variant="solid" disabled={pending} className="mb-1">
        {pending ? "Creating…" : "Create period"}
      </AdminButton>
    </form>
  );
}
