/**
 * Supabase environment configuration.
 * Set NEXT_PUBLIC_USE_SUPABASE=true when ready to read from the database.
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return key;
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return key;
}

/** Feature flag — intent to use Supabase (may be true before keys are pasted) */
export function isSupabaseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_SUPABASE === "true";
}

function isConfiguredSupabaseUrl(url: string): boolean {
  return (
    url.startsWith("https://") &&
    url.includes(".supabase.") &&
    !/PASTE_|your-project|example\.com/i.test(url)
  );
}

/** True when public URL and anon key are set and look valid */
export function hasSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return Boolean(key && isConfiguredSupabaseUrl(url));
}

/**
 * True when Supabase should be used for storefront data.
 * Requires flag + credentials — falls back to local data if keys are still empty.
 */
export function canUseSupabaseDataSource(): boolean {
  return isSupabaseEnabled() && hasSupabaseEnv();
}

/** Required for admin CMS mutations (service role, server-only) */
export function hasSupabaseServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
