/**
 * Edge-safe admin auth paths (plain string literals).
 * Middleware must import from here — not from route objects with functions.
 */

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";
export const ADMIN_AUTH_CALLBACK_PATH = "/admin/auth/callback";

/** Paths that must never be used as a post-login return target */
const BLOCKED_RETURN_PREFIXES = [ADMIN_LOGIN_PATH, ADMIN_AUTH_CALLBACK_PATH] as const;

/** Validate and normalize return path after login */
export function sanitizeAdminReturnTo(
  returnTo: string | null | undefined,
  fallback: string = ADMIN_HOME_PATH,
): string {
  if (!returnTo) return fallback;

  const path = returnTo.startsWith("/") ? returnTo : `/${returnTo}`;

  if (!path.startsWith("/admin")) return fallback;

  for (const blocked of BLOCKED_RETURN_PREFIXES) {
    if (path === blocked || path.startsWith(`${blocked}/`)) {
      return fallback;
    }
  }

  return path;
}

/** Build login URL with optional return path, e.g. /admin/login?next=/admin/products */
export function buildAdminLoginUrl(returnTo?: string | null): string {
  const next = sanitizeAdminReturnTo(returnTo);
  return `${ADMIN_LOGIN_PATH}?${new URLSearchParams({ next }).toString()}`;
}

/** Build login URL with error query param */
export function buildAdminLoginErrorUrl(
  error: string,
  returnTo?: string | null,
): string {
  const params = new URLSearchParams({ error });
  const next = sanitizeAdminReturnTo(returnTo, "");
  if (next) params.set("next", next);
  return `${ADMIN_LOGIN_PATH}?${params.toString()}`;
}
