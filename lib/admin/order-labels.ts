import type { FulfillmentStatus, OrderStatus } from "@/types/database/schema";

export function paymentStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "paid":
    case "shipped":
    case "completed":
      return "Paid";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function fulfillmentStatusLabel(status: FulfillmentStatus): string {
  switch (status) {
    case "unfulfilled":
      return "Unfulfilled";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    default:
      return status;
  }
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(amount: number, currency: string): string {
  return `${Number(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}
