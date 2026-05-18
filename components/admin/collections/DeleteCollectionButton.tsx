"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCollectionAction } from "@/lib/admin/actions/collections";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export function DeleteCollectionButton({ collectionId }: { collectionId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <AdminButton
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this collection?")) return;
        startTransition(async () => {
          const result = await deleteCollectionAction(collectionId);
          if (!result.ok) alert(result.error);
          else router.push(ADMIN_ROUTES.collections);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete collection"}
    </AdminButton>
  );
}
