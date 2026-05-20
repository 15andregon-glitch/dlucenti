"use server";

import { redirect } from "next/navigation";
import { sanitizeAdminReturnTo } from "@/lib/admin/auth-urls";
import { getAdminSession } from "@/lib/admin/auth";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { actionError } from "@/lib/admin/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return actionError("Email and password are required");
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return actionError("Invalid email or password");
  }

  const session = await getAdminSession();
  if (!session) {
    await supabase.auth.signOut();
    return actionError("You do not have access to this CMS");
  }

  const next = sanitizeAdminReturnTo(String(formData.get("next") ?? "").trim());
  redirect(next);
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ADMIN_ROUTES.login);
}
