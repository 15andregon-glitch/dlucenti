import "server-only";

import { buildMessageId } from "@/lib/emails/deliverability";
import {
  buildAdminOrderEmailHtml,
  buildCustomerOrderEmailHtml,
} from "@/lib/emails/order-email-template";
import {
  buildAdminOrderEmailText,
  buildCustomerOrderEmailText,
} from "@/lib/emails/order-email-plain";
import { getOrderEmailCopy } from "@/lib/emails/order-email-copy";
import type { OrderEmailPayload } from "@/lib/emails/order-email-types";
import { sendTransactionalEmail } from "@/lib/emails/resend-send";
import { getAdminOrderEmail } from "@/lib/resend/config";

function logInfo(message: string, meta?: Record<string, unknown>) {
  if (meta) console.info(`[email] ${message}`, meta);
  else console.info(`[email] ${message}`);
}

/**
 * Sends customer confirmation + admin notification.
 * Never throws — webhook/checkout must not fail if email is unavailable.
 */
export async function sendOrderEmails(payload: OrderEmailPayload): Promise<void> {
  const customerCopy = getOrderEmailCopy(payload.locale, "customer");

  if (payload.customerEmail) {
    await sendTransactionalEmail({
      to: payload.customerEmail,
      subject: customerCopy.customerSubject(payload.orderNumber),
      html: buildCustomerOrderEmailHtml(payload),
      text: buildCustomerOrderEmailText(payload),
      tag: "order-confirmation",
      referenceId: payload.orderId,
      messageId: buildMessageId("order-confirmation", payload.orderId),
      includeListUnsubscribe: true,
    });
  } else {
    logInfo("customer confirmation skipped — no customer email", {
      orderNumber: payload.orderNumber,
    });
  }

  const adminEmail = getAdminOrderEmail();
  if (!adminEmail) {
    logInfo("admin notification skipped — ADMIN_ORDER_EMAIL not set", {
      orderNumber: payload.orderNumber,
    });
    return;
  }

  const adminCopy = getOrderEmailCopy(payload.locale, "admin");
  await sendTransactionalEmail({
    to: adminEmail,
    subject: adminCopy.adminSubject(payload.orderNumber),
    html: buildAdminOrderEmailHtml(payload),
    text: buildAdminOrderEmailText(payload),
    tag: "order-admin",
    referenceId: payload.orderId,
    messageId: buildMessageId("order-admin", payload.orderId),
    includeListUnsubscribe: false,
  });
}
