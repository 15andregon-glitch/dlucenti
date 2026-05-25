import type { Locale } from "@/lib/i18n/locale";

export interface ShippingEmailPayload {
  locale: Locale;
  orderNumber: string;
  orderId: string;
  customerName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courier: string | null;
}
