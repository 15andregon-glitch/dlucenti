"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProductAction } from "@/lib/admin/actions/products";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <AdminButton
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this product permanently?")) return;
        startTransition(async () => {
          const result = await deleteProductAction(productId);
          if (!result.ok) alert(result.error);
          else router.push(ADMIN_ROUTES.products);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete product"}
    </AdminButton>
  );
}
