import type { SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

export async function fetchReportingPeriods(client: Client, year?: number) {
  let q = client
    .from("reporting_periods")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false, nullsFirst: false });

  if (year) q = q.eq("year", year);
  return q;
}

export async function fetchReportingPeriodById(client: Client, id: string) {
  return client.from("reporting_periods").select("*").eq("id", id).maybeSingle();
}

export async function fetchPeriodForDate(client: Client, date: string) {
  return client
    .from("reporting_periods")
    .select("*")
    .lte("starts_at", date)
    .gte("ends_at", date)
    .eq("period_type", "month")
    .maybeSingle();
}
