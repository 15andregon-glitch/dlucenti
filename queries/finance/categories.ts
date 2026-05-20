import type { SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

export async function fetchFinancialCategories(client: Client, activeOnly = true) {
  let q = client.from("financial_categories").select("*").order("sort_order");
  if (activeOnly) q = q.eq("is_active", true);
  return q;
}

export async function fetchCategoryByCode(client: Client, code: string) {
  return client.from("financial_categories").select("*").eq("code", code).maybeSingle();
}
