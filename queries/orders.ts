import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesUpdate } from "@/types/database";

export type OrderRow = Tables<"orders">;
export type OrderItemRow = Tables<"order_items">;

export type OrderWithItems = OrderRow & {
  order_items: OrderItemRow[];
};

export async function listOrders(
  client: SupabaseClient<Database>,
): Promise<OrderRow[]> {
  const { data, error } = await client
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getOrderById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<OrderWithItems | null> {
  const { data, error } = await client
    .from("orders")
    .select("*, order_items (*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as OrderWithItems | null;
}

export async function updateOrder(
  client: SupabaseClient<Database>,
  id: string,
  row: TablesUpdate<"orders">,
): Promise<OrderRow> {
  const { data, error } = await client
    .from("orders")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
