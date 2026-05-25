import "server-only";

import { Resend } from "resend";
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

/** Send a transactional email via Resend. Never throws. Returns true if sent. */
export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
  tag: string;
}): Promise<boolean> {
  if (!isResendConfigured()) {
    logInfo("skipped — RESEND_API_KEY not configured", { tag: params.tag });
    return false;
  }

  const apiKey = getResendApiKey();
  if (!apiKey) return false;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: getResendFromEmail(),
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
  } catch (error) {
    logError(`unexpected error (${params.tag})`, error, { to: params.to });
    return false;
  }
}
