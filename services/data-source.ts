import { canUseSupabaseDataSource } from "@/lib/supabase/env";

/**
 * Data source switch — NEXT_PUBLIC_USE_SUPABASE=true plus valid URL/key.
 * Falls back to /lib/data when keys are empty (safe while configuring .env.local).
 */
export function useSupabaseDataSource(): boolean {
  return canUseSupabaseDataSource();
}
