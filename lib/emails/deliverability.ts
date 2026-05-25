import "server-only";

/** Verified sending domain — align SPF/DKIM/DMARC in Resend dashboard for dlucenti.com */
export const EMAIL_DOMAIN = "dlucenti.com";
export const EMAIL_FROM_ADDRESS = `hello@${EMAIL_DOMAIN}`;
export const DEFAULT_FROM = `D'LUCENTI <${EMAIL_FROM_ADDRESS}>`;
export const DEFAULT_REPLY_TO = EMAIL_FROM_ADDRESS;

export type TransactionalEmailKind =
  | "order-confirmation"
  | "order-admin"
  | "shipping-confirmation";

function sanitizeMessageIdPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 64);
}

/** RFC 5322 Message-ID on our domain (helps alignment with From domain) */
export function buildMessageId(
  kind: TransactionalEmailKind,
  referenceId: string,
): string {
  const part = sanitizeMessageIdPart(referenceId);
  const stamp = Date.now().toString(36);
  return `<${kind}.${part}.${stamp}@${EMAIL_DOMAIN}>`;
}

export function buildListUnsubscribeHeader(): string {
  return `<mailto:${EMAIL_FROM_ADDRESS}?subject=${encodeURIComponent("Suporte")}>, <https://${EMAIL_DOMAIN}/contact>`;
}

export function buildTransactionalHeaders(options: {
  messageId: string;
  includeListUnsubscribe?: boolean;
}): Record<string, string> {
  const headers: Record<string, string> = {
    "Message-ID": options.messageId,
    Precedence: "auto",
    "X-Auto-Response-Suppress": "All",
  };

  if (options.includeListUnsubscribe) {
    headers["List-Unsubscribe"] = buildListUnsubscribeHeader();
  }

  return headers;
}
