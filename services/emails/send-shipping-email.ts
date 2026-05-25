import "server-only";

import { buildShippingConfirmationEmailHtml } from "@/lib/emails/shipping-email-template";
import { getShippingEmailCopy } from "@/lib/emails/shipping-email-copy";
import { sendTransactionalEmail } from "@/lib/emails/resend-send";
import type { Locale } from "@/lib/i18n/locale";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n/locale";

export interface ShippingEmailOrder {
  orderNumber: string;
  customerEmail: string | null;
  customerName: string | null;
  locale: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courier: string | null;
}

function resolveLocale(raw: string | null): Locale {
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

/** Never throws. Returns true when Resend accepted the message. */
export async function sendShippingConfirmationEmail(
  order: ShippingEmailOrder,
): Promise<boolean> {
  if (!order.customerEmail) {
    console.info("[email] shipping confirmation skipped — no customer email", {
      orderNumber: order.orderNumber,
    });
    return false;
  }

  const locale = resolveLocale(order.locale);
  const copy = getShippingEmailCopy(locale);

  return sendTransactionalEmail({
    to: order.customerEmail,
    subject: copy.subject,
    html: buildShippingConfirmationEmailHtml({
      locale,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      courier: order.courier,
    }),
    tag: "shipping-confirmation",
  });
}
