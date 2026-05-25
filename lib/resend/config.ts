import "server-only";

const DEFAULT_FROM = "D'LUCENTI <hello@dlucenti.com>";

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || null;
}

export function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

export function getAdminOrderEmail(): string | null {
  const email = process.env.ADMIN_ORDER_EMAIL?.trim();
  return email || null;
}

export function isResendConfigured(): boolean {
  return Boolean(getResendApiKey());
}
