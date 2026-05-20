"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteFinancialEntryAction } from "@/lib/admin/actions/finance";
import { formatCurrency } from "@/lib/finance/format";
import type { FinancialEntry } from "@/types/finance";
import { AdminButton } from "@/components/admin/ui/AdminButton";

interface EntriesListProps {
  entries: FinancialEntry[];
  periodId: string;
  emptyMessage?: string;
}

export function EntriesList({
  entries,
  periodId,
  emptyMessage = "No entries for this period.",
}: EntriesListProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!entries.length) {
    return (
      <p className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">{emptyMessage}</p>
    );
  }

  return (
    <div className="admin-panel overflow-x-auto p-0">
      <table className="admin-table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Source</th>
            <th className="text-right">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="font-sans text-[0.8125rem] tabular-nums text-[var(--maison-gray)]">
                {e.entry_date}
              </td>
              <td className="text-[0.8125rem] text-[var(--maison-charcoal)]">
                {e.category?.name_pt || e.category?.name || "—"}
              </td>
              <td className="font-sans text-[0.75rem] uppercase tracking-wider text-[var(--maison-mist)]">
                {e.source}
              </td>
              <td className="text-right font-sans text-[0.8125rem] tabular-nums">
                {formatCurrency(e.amount)}
              </td>
              <td className="text-right">
                {e.source === "manual" && (
                  <AdminButton
                    type="button"
                    variant="default"
                    disabled={pending}
                    className="text-[0.75rem]"
                    onClick={() => {
                      if (!confirm("Remove this entry?")) return;
                      startTransition(async () => {
                        const result = await deleteFinancialEntryAction(e.id, periodId);
                        if (!result.ok) alert(result.error);
                        else router.refresh();
                      });
                    }}
                  >
                    Remove
                  </AdminButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
