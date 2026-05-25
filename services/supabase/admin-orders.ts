import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getOrderById,
  listOrders,
  updateOrder,
  type OrderRow,
  type OrderWithItems,
} from "@/queries/orders";
import type { TablesUpdate } from "@/types/database";

function admin() {
  return createSupabaseAdminClient();
}

export async function listOrdersAdmin(): Promise<OrderRow[]> {
  return listOrders(admin());
}

export async function getOrderAdmin(id: string): Promise<OrderWithItems | null> {
  return getOrderById(admin(), id);
}

export async function updateOrderAdmin(
  id: string,
  row: TablesUpdate<"orders">,
): Promise<OrderRow> {
  return updateOrder(admin(), id, row);
}
