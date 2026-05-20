import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH, sanitizeAdminReturnTo } from "@/lib/admin/auth-urls";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/types/database/schema";

function redirectToAdminLogin(returnPath: string): never {
  const next = sanitizeAdminReturnTo(returnPath);
  redirect(`${ADMIN_LOGIN_PATH}?next=${encodeURIComponent(next)}`);
}

export type AdminSession = {
  userId: string;
  email: string;
  role: AdminRole;
};

/** Read session without redirect — for actions and middleware helpers */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) return null;

  return {
    userId: admin.id,
    email: admin.email,
    role: admin.role,
  };
}

async function getReturnPathFromHeaders(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  return sanitizeAdminReturnTo(pathname, ADMIN_ROUTES.home);
}

/** Protect server layouts/pages — redirects if not an admin */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirectToAdminLogin(await getReturnPathFromHeaders());
  }
  return session;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

/** Guard server actions — returns error instead of redirect */
export async function assertAdminForAction(): Promise<
  AdminSession | { ok: false; error: string }
> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, error: "Unauthorized" };
  }
  return session;
}
