"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { recomputeDRAction, syncOrdersAction } from "@/lib/admin/actions/finance";
import { AdminButton } from "@/components/admin/ui/AdminButton";

interface FinanceToolbarProps {
  periodId: string;
}

export function FinanceToolbar({ periodId }: FinanceToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      <AdminButton
        type="button"
        disabled={pending || !periodId}
        onClick={() => {
          startTransition(async () => {
            const result = await recomputeDRAction(periodId);
            if (!result.ok) alert(result.error);
            else router.refresh();
          });
        }}
      >
        Recompute DR
      </AdminButton>
      <AdminButton
        type="button"
        disabled={pending || !periodId}
        onClick={() => {
          startTransition(async () => {
            const result = await syncOrdersAction(periodId);
            if (!result.ok) alert(result.error);
            else {
              alert(`Synced ${"count" in result ? result.count : 0} orders`);
              router.refresh();
            }
          });
        }}
      >
        Sync orders
      </AdminButton>
    </div>
  );
}
