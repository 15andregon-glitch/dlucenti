import { assertAdminForAction } from "@/lib/admin/auth";

/** Returns an error result if the caller is not an authenticated admin */
export async function guardAdminAction(): Promise<{ ok: false; error: string } | null> {
  const auth = await assertAdminForAction();
  if ("ok" in auth && auth.ok === false) {
    return auth;
  }
  return null;
}
