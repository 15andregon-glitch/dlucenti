import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderFulfillmentPanel } from "@/components/admin/orders/OrderFulfillmentPanel";
import { StatusBadge } from "@/components/admin/orders/StatusBadge";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  formatMoney,
  formatOrderDate,
  fulfillmentStatusLabel,
  paymentStatusLabel,
} from "@/lib/admin/order-labels";
import { getOrderAdmin } from "@/services/supabase/admin-orders";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: Awaited<ReturnType<typeof getOrderAdmin>> = null;

  try {
    order = await getOrderAdmin(id);
  } catch {
    notFound();
  }

  if (!order) notFound();

  const items = order.order_items ?? [];

  return (
    <AdminShell
      title={order.order_number}
      description={`Placed ${formatOrderDate(order.created_at)}`}
      actions={
        <Link
          href={ADMIN_ROUTES.orders}
          className="font-sans text-[0.8125rem] text-[var(--maison-mist)] transition-opacity hover:text-[var(--maison-charcoal)]"
        >
          ← All orders
        </Link>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="space-y-8">
          <AdminPanel title="Customer">
            <dl className="space-y-4 font-sans text-[0.8125rem]">
              <DetailRow label="Name" value={order.customer_name ?? "—"} />
              <DetailRow label="Email" value={order.customer_email ?? "—"} />
              <DetailRow
                label="Shipping address"
                value={
                  order.shipping_address ? (
                    <span className="whitespace-pre-line">{order.shipping_address}</span>
                  ) : (
                    "—"
                  )
                }
              />
              <DetailRow label="Locale" value={order.locale ?? "en"} />
            </dl>
          </AdminPanel>

          <AdminPanel title="Items">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Line</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td className="tabular-nums">{item.quantity}</td>
                      <td className="tabular-nums whitespace-nowrap">
                        {formatMoney(Number(item.unit_price), order.currency)}
                      </td>
                      <td className="tabular-nums whitespace-nowrap">
                        {formatMoney(
                          Number(item.unit_price) * item.quantity,
                          order.currency,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <AdminPanel title="Payment & Stripe">
            <dl className="space-y-4 font-sans text-[0.8125rem]">
              <DetailRow
                label="Payment"
                value={<StatusBadge label={paymentStatusLabel(order.status)} tone="success" />}
              />
              <DetailRow
                label="Fulfillment"
                value={
                  <StatusBadge
                    label={fulfillmentStatusLabel(order.fulfillment_status)}
                    tone={
                      order.fulfillment_status === "shipped" ? "success" : "neutral"
                    }
                  />
                }
              />
              <DetailRow
                label="Subtotal"
                value={formatMoney(Number(order.subtotal), order.currency)}
              />
              <DetailRow
                label="Shipping"
                value={formatMoney(Number(order.shipping_cost), order.currency)}
              />
              <DetailRow
                label="Total"
                value={formatMoney(Number(order.total), order.currency)}
              />
              <DetailRow label="Stripe session" value={order.stripe_session_id ?? "—"} />
              <DetailRow
                label="Payment intent"
                value={order.stripe_payment_intent ?? "—"}
              />
              <DetailRow label="Order ID" value={order.id} />
            </dl>
          </AdminPanel>
        </div>

        <div>
          <OrderFulfillmentPanel order={order} />
        </div>
      </div>
    </AdminShell>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
      <dt className="admin-label pt-0.5">{label}</dt>
      <dd className="text-[var(--maison-charcoal)]">{value}</dd>
    </div>
  );
}
