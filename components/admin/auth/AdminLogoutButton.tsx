"use client";

import { useTransition } from "react";
import { logoutAction } from "@/lib/admin/actions/auth";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export function AdminLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <AdminButton
      type="button"
      variant="danger"
      disabled={pending}
      className="mt-4 w-full justify-center text-[0.75rem]"
      onClick={() => startTransition(() => logoutAction())}
    >
      {pending ? "Signing out…" : "Sign out"}
    </AdminButton>
  );
}
