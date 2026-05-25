import "server-only";

import { Resend } from "resend";
import {
  buildTransactionalHeaders,
  DEFAULT_FROM,
  DEFAULT_REPLY_TO,
  type TransactionalEmailKind,
} from "@/lib/emails/deliverability";
import { getResendApiKey, getResendFromEmail, isResendConfigured } from "@/lib/resend/config";

function logInfo(message: string, meta?: Record<string, unknown>) {
  if (meta) console.info(`[email] ${message}`, meta);
  else console.info(`[email] ${message}`);
}

function logError(message: string, error: unknown, meta?: Record<string, unknown>) {
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : { message: String(error) };
  console.error(`[email] ${message}`, { ...meta, ...detail });
}

export interface SendTransactionalEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  tag: TransactionalEmailKind;
  referenceId: string;
  messageId: string;
  replyTo?: string;
  includeListUnsubscribe?: boolean;
}

/** Send a transactional email via Resend. Never throws. Returns true if sent. */
export async function sendTransactionalEmail(
  params: SendTransactionalEmailParams,
): Promise<boolean> {
  if (!isResendConfigured()) {
    logInfo("skipped — RESEND_API_KEY not configured", { tag: params.tag });
    return false;
  }

  const apiKey = getResendApiKey();
  if (!apiKey) return false;

  const from = getResendFromEmail();
  const replyTo = params.replyTo ?? DEFAULT_REPLY_TO;

  if (!from.includes("dlucenti.com")) {
    logInfo("warning — FROM address should use verified dlucenti.com domain for SPF/DKIM alignment", {
      from,
    });
  }

  try {
    const resend = new Resend(apiKey);
    const headers = buildTransactionalHeaders({
      messageId: params.messageId,
      includeListUnsubscribe: params.includeListUnsubscribe ?? true,
    });

    const { data, error } = await resend.emails.send({
      from: from || DEFAULT_FROM,
      to: params.to,
      replyTo,
      subject: params.subject,
      html: params.html,
      text: params.text,
      headers,
      tags: [{ name: "type", value: params.tag }],
    });

    if (error) {
      logError(`send failed (${params.tag})`, error, { to: params.to });
      return false;
    }

    logInfo(`sent (${params.tag})`, {
      to: params.to,
      id: data?.id,
      messageId: params.messageId,
    });
    return true;
  } catch (error) {
    logError(`unexpected error (${params.tag})`, error, { to: params.to });
    return false;
  }
}
