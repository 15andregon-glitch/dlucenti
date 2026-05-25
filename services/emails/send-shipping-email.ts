import "server-only";

import { buildMessageId } from "@/lib/emails/deliverability";
import { buildShippingConfirmationEmailHtml } from "@/lib/emails/shipping-email-template";
import { buildShippingConfirmationEmailText } from "@/lib/emails/shipping-email-plain";
import { getShippingEmailCopy } from "@/lib/emails/shipping-email-copy";
import type { ShippingEmailPayload } from "@/lib/emails/shipping-email-types";
import { sendTransactionalEmail } from "@/lib/emails/resend-send";
import type { Locale } from "@/lib/i18n/locale";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n/locale";

export interface ShippingEmailOrder {
  id: string;
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
  const payload: ShippingEmailPayload = {
    locale,
    orderNumber: order.orderNumber,
    orderId: order.id,
    customerName: order.customerName,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    courier: order.courier,
  };

  return sendTransactionalEmail({
    to: order.customerEmail,
    subject: copy.subject(order.orderNumber),
    html: buildShippingConfirmationEmailHtml(payload),
    text: buildShippingConfirmationEmailText(payload),
    tag: "shipping-confirmation",
    referenceId: order.id,
    messageId: buildMessageId("shipping-confirmation", order.id),
    includeListUnsubscribe: true,
  });
}
