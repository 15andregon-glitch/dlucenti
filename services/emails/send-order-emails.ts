import "server-only";

import { Resend } from "resend";
import {
  buildAdminOrderEmailHtml,
  buildCustomerOrderEmailHtml,
} from "@/lib/emails/order-email-template";
import { getOrderEmailCopy } from "@/lib/emails/order-email-copy";
import type { OrderEmailPayload } from "@/lib/emails/order-email-types";
import {
  getAdminOrderEmail,
  getResendApiKey,
  getResendFromEmail,
  isResendConfigured,
} from "@/lib/resend/config";

function logInfo(message: string, meta?: Record<string, unknown>) {
  if (meta) {
    console.info(`[email] ${message}`, meta);
  } else {
    console.info(`[email] ${message}`);
  }
}

function logError(message: string, error: unknown, meta?: Record<string, unknown>) {
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : { message: String(error) };
  console.error(`[email] ${message}`, { ...meta, ...detail });
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  resend: Resend;
  from: string;
  tag: string;
}): Promise<boolean> {
  const { data, error } = await params.resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    logError(`send failed (${params.tag})`, error, { to: params.to });
    return false;
  }

  logInfo(`sent (${params.tag})`, { to: params.to, id: data?.id });
  return true;
}

/**
 * Sends customer confirmation + admin notification.
 * Never throws — webhook/checkout must not fail if email is unavailable.
 */
export async function sendOrderEmails(payload: OrderEmailPayload): Promise<void> {
  if (!isResendConfigured()) {
    logInfo("skipped — RESEND_API_KEY not configured", {
      orderNumber: payload.orderNumber,
    });
    return;
  }

  const apiKey = getResendApiKey();
  if (!apiKey) return;

  const from = getResendFromEmail();
  const resend = new Resend(apiKey);
  const copy = getOrderEmailCopy(payload.locale, "customer");

  if (payload.customerEmail) {
    try {
      await sendEmail({
        resend,
        from,
        to: payload.customerEmail,
        subject: copy.customerSubject,
        html: buildCustomerOrderEmailHtml(payload),
        tag: "order-confirmation",
      });
    } catch (error) {
      logError("customer confirmation unexpected error", error, {
        orderNumber: payload.orderNumber,
      });
    }
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

  try {
    const adminCopy = getOrderEmailCopy(payload.locale, "admin");
    await sendEmail({
      resend,
      from,
      to: adminEmail,
      subject: adminCopy.adminSubject(payload.orderNumber),
      html: buildAdminOrderEmailHtml(payload),
      tag: "admin-notification",
    });
  } catch (error) {
    logError("admin notification unexpected error", error, {
      orderNumber: payload.orderNumber,
    });
  }
}
