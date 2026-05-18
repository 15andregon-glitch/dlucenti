/**
 * Admin auth — prepared for Supabase Auth + public.admins role checks.
 * Not enforced yet; wire requireAdmin() in app/admin/layout when ready.
 */

export type AdminSession = {
  userId: string;
  email: string;
  role: "owner" | "editor" | "viewer";
};

/** Placeholder: returns true until auth is implemented */
export async function requireAdmin(): Promise<AdminSession | null> {
  // TODO: createServerClient + getSession + admins table lookup
  return null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await requireAdmin();
  return session !== null;
}
