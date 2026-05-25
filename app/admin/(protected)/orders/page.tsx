import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/orders/StatusBadge";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  formatMoney,
  formatOrderDate,
  fulfillmentStatusLabel,
  paymentStatusLabel,
} from "@/lib/admin/order-labels";
import { listOrdersAdmin } from "@/services/supabase/admin-orders";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof listOrdersAdmin>> = [];
  let loadError: string | null = null;

  try {
    orders = await listOrdersAdmin();
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Unable to load orders. Run supabase/orders-fulfillment.sql if this is a new install.";
  }

  return (
    <AdminShell
      title="Orders"
      description="Customer orders from Stripe Checkout — payment and fulfillment."
    >
      {loadError ? (
        <AdminPanel>
          <p className="font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
            {loadError}
          </p>
        </AdminPanel>
      ) : (
        <div className="admin-panel overflow-x-auto p-0">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-sans font-extralight text-[0.9375rem] tabular-nums">
                    {order.order_number}
                  </td>
                  <td>
                    <p className="font-sans text-[0.8125rem] text-[var(--maison-charcoal)]">
                      {order.customer_name ?? "—"}
                    </p>
                    <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
                      {order.customer_email ?? "—"}
                    </p>
                  </td>
                  <td className="tabular-nums whitespace-nowrap">
                    {formatMoney(Number(order.total), order.currency)}
                  </td>
                  <td>
                    <StatusBadge
                      label={paymentStatusLabel(order.status)}
                      tone={order.status === "paid" || order.status === "shipped" ? "success" : "neutral"}
                    />
                  </td>
                  <td>
                    <StatusBadge
                      label={fulfillmentStatusLabel(order.fulfillment_status)}
                      tone={
                        order.fulfillment_status === "shipped"
                          ? "success"
                          : order.fulfillment_status === "processing"
                            ? "warning"
                            : "muted"
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap text-[var(--maison-mist)]">
                    {formatOrderDate(order.created_at)}
                  </td>
                  <td className="text-right">
                    <Link
                      href={ADMIN_ROUTES.order(order.id)}
                      className="text-[0.8125rem] text-[var(--maison-charcoal)] hover:opacity-60"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="p-8 text-[0.8125rem] text-[var(--maison-mist)]">
              No orders yet. Orders appear here after Stripe Checkout payments.
            </p>
          )}
        </div>
      )}
    </AdminShell>
  );
}
