import type { SupabaseClient } from "@supabase/supabase-js";
import type { FinancialCategoryGroup } from "@/types/finance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

export async function fetchEntriesForPeriod(client: Client, periodId: string) {
  return client
    .from("financial_entries")
    .select("*, financial_categories (*)")
    .eq("period_id", periodId)
    .order("entry_date", { ascending: false });
}

export async function fetchEntriesForPeriods(
  client: Client,
  periodIds: string[],
) {
  if (!periodIds.length) return { data: [], error: null };
  return client
    .from("financial_entries")
    .select("*, financial_categories (*)")
    .in("period_id", periodIds);
}

export async function fetchEntriesByGroup(
  client: Client,
  periodId: string,
  group: FinancialCategoryGroup,
) {
  return client
    .from("financial_entries")
    .select("*, financial_categories!inner (*)")
    .eq("period_id", periodId)
    .eq("financial_categories.group_type", group);
}
