import "server-only";

import { DEFAULT_FROM, DEFAULT_REPLY_TO } from "@/lib/emails/deliverability";

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || null;
}

export function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

export function getResendReplyToEmail(): string {
  return process.env.RESEND_REPLY_TO_EMAIL?.trim() || DEFAULT_REPLY_TO;
}

export function getAdminOrderEmail(): string | null {
  const email = process.env.ADMIN_ORDER_EMAIL?.trim();
  return email || null;
}

export function isResendConfigured(): boolean {
  return Boolean(getResendApiKey());
}
