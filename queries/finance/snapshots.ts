import type { SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

export async function fetchDRSnapshot(client: Client, periodId: string) {
  return client
    .from("dr_snapshots")
    .select("*")
    .eq("period_id", periodId)
    .maybeSingle();
}

export async function upsertDRSnapshot(
  client: Client,
  periodId: string,
  snapshot: object,
) {
  return client
    .from("dr_snapshots")
    .upsert(
      { period_id: periodId, snapshot, computed_at: new Date().toISOString() },
      { onConflict: "period_id" },
    )
    .select()
    .single();
}
