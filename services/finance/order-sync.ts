import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fetchCategoryByCode } from "@/queries/finance";
import type { TablesInsert } from "@/types/database";

type FinancialEntryInsert = TablesInsert<"financial_entries">;

interface OrderRow {
  id: string;
  subtotal: number;
  shipping_cost: number;
  period_id: string | null;
  created_at: string;
}

interface OrderItemRow {
  quantity: number;
  unit_cost: number;
}

/** Sync completed orders into financial_entries for CMVMC, revenue, logistics */
export async function syncOrdersToFinance(periodId: string): Promise<number> {
  const client = createSupabaseAdminClient();

  const { data: orders, error } = await client
    .from("orders")
    .select("id, subtotal, shipping_cost, period_id, created_at, order_items (quantity, unit_cost)")
    .eq("period_id", periodId)
    .eq("synced_to_finance", false)
    .in("status", ["paid", "shipped", "completed"]);

  if (error) throw error;
  if (!orders?.length) return 0;

  const [salesCat, cmvmcCat, logisticsCat] = await Promise.all([
    fetchCategoryByCode(client, "sales_revenue"),
    fetchCategoryByCode(client, "cmvmc"),
    fetchCategoryByCode(client, "logistics"),
  ]);

  if (!salesCat.data || !cmvmcCat.data) {
    throw new Error("Financial categories not seeded");
  }

  let synced = 0;

  for (const order of orders as (OrderRow & { order_items: OrderItemRow[] })[]) {
    const subtotal = Number(order.subtotal);
    const shipping = Number(order.shipping_cost);
    const cogs = (order.order_items ?? []).reduce(
      (s, i) => s + Number(i.unit_cost) * Number(i.quantity),
      0,
    );

    const entryDate = order.created_at.split("T")[0];
    const rows: FinancialEntryInsert[] = [
      {
        period_id: periodId,
        category_id: salesCat.data.id,
        amount: subtotal,
        source: "order" as const,
        source_ref: order.id,
        description: `Order revenue`,
        entry_date: entryDate,
      },
      {
        period_id: periodId,
        category_id: cmvmcCat.data.id,
        amount: cogs,
        source: "order" as const,
        source_ref: order.id,
        description: `Order COGS`,
        entry_date: entryDate,
      },
    ];

    if (shipping > 0 && logisticsCat.data) {
      rows.push({
        period_id: periodId,
        category_id: logisticsCat.data.id,
        amount: shipping,
        source: "shipping" as const,
        source_ref: order.id,
        description: `Order shipping`,
        entry_date: entryDate,
      });
    }

    await client.from("financial_entries").insert(rows);
    await client
      .from("orders")
      .update({ synced_to_finance: true })
      .eq("id", order.id);

    synced++;
  }

  return synced;
}
