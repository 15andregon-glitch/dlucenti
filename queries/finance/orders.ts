import type { SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

export async function fetchOrders(client: Client, unsyncedOnly = false) {
  let q = client
    .from("orders")
    .select("*, order_items (*)")
    .order("created_at", { ascending: false });

  if (unsyncedOnly) q = q.eq("synced_to_finance", false);
  return q;
}

export async function fetchOrdersForPeriod(client: Client, periodId: string) {
  return client
    .from("orders")
    .select("*, order_items (*)")
    .eq("period_id", periodId)
    .in("status", ["paid", "shipped", "completed"]);
}
