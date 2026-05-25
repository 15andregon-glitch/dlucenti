import { escapeHtml } from "@/lib/emails/escape-html";
import { getShippingEmailCopy } from "@/lib/emails/shipping-email-copy";
import type { Locale } from "@/lib/i18n/locale";

export interface ShippingEmailPayload {
  locale: Locale;
  orderNumber: string;
  customerName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courier: string | null;
}

const STYLES = {
  body: "margin:0;padding:0;background-color:#f7f4ef;",
  wrap: "max-width:520px;margin:0 auto;padding:48px 28px 56px;",
  label:
    "font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#9a958c;margin:0 0 8px;",
  title:
    "font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;letter-spacing:-0.02em;line-height:1.15;color:#3a3834;margin:0 0 20px;",
  text: "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.75;color:#6e6a63;margin:0 0 16px;",
  link:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;text-decoration:underline;",
  footer:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.65;color:#9a958c;margin:32px 0 0;",
} as const;

export function buildShippingConfirmationEmailHtml(
  payload: ShippingEmailPayload,
): string {
  const copy = getShippingEmailCopy(payload.locale);
  const greeting = payload.customerName
    ? escapeHtml(payload.customerName)
    : null;

  const trackingLines: string[] = [];
  if (payload.courier) {
    trackingLines.push(escapeHtml(payload.courier));
  }
  if (payload.trackingNumber) {
    trackingLines.push(escapeHtml(payload.trackingNumber));
  }

  const trackingBlock =
    trackingLines.length > 0 || payload.trackingUrl
      ? `
        <p style="${STYLES.label}">${escapeHtml(copy.trackingLabel)}</p>
        ${trackingLines.length > 0 ? `<p style="${STYLES.text}">${trackingLines.join("<br />")}</p>` : ""}
        ${
          payload.trackingUrl
            ? `<p style="margin:12px 0 0;"><a href="${escapeHtml(payload.trackingUrl)}" style="${STYLES.link}">${escapeHtml(copy.trackCta)}</a></p>`
            : ""
        }`
      : "";

  return `<!DOCTYPE html>
<html lang="${payload.locale === "pt" ? "pt" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(copy.subject)}</title>
</head>
<body style="${STYLES.body}">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(copy.preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="${STYLES.body}">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="${STYLES.wrap}">
          <tr>
            <td>
              <p style="${STYLES.label}">D'LUCENTI</p>
              <h1 style="${STYLES.title}">${escapeHtml(copy.title)}</h1>
              ${greeting ? `<p style="${STYLES.text}">${greeting},</p>` : ""}
              <p style="${STYLES.text}">${escapeHtml(copy.intro)}</p>
              <p style="${STYLES.text}"><span style="color:#9a958c;">${escapeHtml(copy.orderLabel)}</span> ${escapeHtml(payload.orderNumber)}</p>
              ${trackingBlock}
              <p style="${STYLES.footer}">${escapeHtml(copy.footer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
