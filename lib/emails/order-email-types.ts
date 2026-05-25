import type { Locale } from "@/lib/i18n/locale";

export interface OrderEmailLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderEmailPayload {
  locale: Locale;
  orderId: string;
  orderNumber: string;
  customerEmail: string | null;
  customerName: string | null;
  shippingAddress: string | null;
  currency: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderEmailLineItem[];
}
