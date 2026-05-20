"use client";

import { useTransition } from "react";
import { loginAction } from "@/lib/admin/actions/auth";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminButton } from "@/components/admin/ui/AdminButton";

interface AdminLoginFormProps {
  next?: string;
  initialError?: string | null;
}

export function AdminLoginForm({
  next = ADMIN_ROUTES.home,
  initialError,
}: AdminLoginFormProps) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    formData.set("next", next);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && !result.ok) {
        alert(result.error);
      }
    });
  };

  return (
    <form action={handleSubmit} className="admin-panel space-y-8">
      <input type="hidden" name="next" value={next} readOnly />

      {initialError && (
        <p
          className="border-b border-[var(--maison-hairline)] pb-4 text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]"
          role="alert"
        >
          {initialError}
        </p>
      )}

      <AdminField label="Email" htmlFor="email">
        <AdminInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
        />
      </AdminField>

      <AdminField label="Password" htmlFor="password">
        <AdminInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
        />
      </AdminField>

      <AdminButton
        type="submit"
        variant="solid"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </AdminButton>
    </form>
  );
}
