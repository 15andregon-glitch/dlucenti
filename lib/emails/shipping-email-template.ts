import { escapeHtml } from "@/lib/emails/escape-html";
import { getShippingEmailCopy } from "@/lib/emails/shipping-email-copy";
import type { ShippingEmailPayload } from "@/lib/emails/shipping-email-types";

const BODY =
  "margin:0;padding:0;background:#f7f4ef;font-family:Georgia,'Times New Roman',serif;color:#3a3834;";
const MAIN = "max-width:520px;margin:0 auto;padding:32px 24px 40px;";
const P = "font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#5c5852;margin:0 0 14px;";
const H1 = "font-size:20px;font-weight:400;line-height:1.3;margin:0 0 16px;color:#3a3834;";
const LABEL = "font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a958c;margin:20px 0 8px;";
const FOOTER = "font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9a958c;margin:28px 0 0;";
const LINK = "color:#3a3834;text-decoration:underline;";

export function buildShippingConfirmationEmailHtml(
  payload: ShippingEmailPayload,
): string {
  const copy = getShippingEmailCopy(payload.locale);
  const lang = payload.locale === "pt" ? "pt" : "en";
  const greeting = payload.customerName
    ? `<p style="${P}">${escapeHtml(payload.customerName)},</p>`
    : "";

  const trackingParts: string[] = [];
  if (payload.courier) trackingParts.push(escapeHtml(payload.courier));
  if (payload.trackingNumber) trackingParts.push(escapeHtml(payload.trackingNumber));

  const trackingBlock =
    trackingParts.length > 0 || payload.trackingUrl
      ? `<p style="${LABEL}">${escapeHtml(copy.trackingLabel)}</p>
         ${trackingParts.length > 0 ? `<p style="${P}">${trackingParts.join("<br />")}</p>` : ""}
         ${
           payload.trackingUrl
             ? `<p style="${P}"><a href="${escapeHtml(payload.trackingUrl)}" style="${LINK}">${escapeHtml(copy.trackCta)}</a></p>`
             : ""
         }`
      : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(copy.subject(payload.orderNumber))}</title>
</head>
<body style="${BODY}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader(payload.orderNumber))}</div>
<main style="${MAIN}">
<p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a958c;margin:0 0 12px;">D'LUCENTI</p>
<h1 style="${H1}">${escapeHtml(copy.title)}</h1>
${greeting}
<p style="${P}">${escapeHtml(copy.intro)}</p>
<p style="${P}"><span style="color:#9a958c;">${escapeHtml(copy.orderLabel)}:</span> ${escapeHtml(payload.orderNumber)}</p>
${trackingBlock}
<p style="${FOOTER}">${escapeHtml(copy.footer)}</p>
</main>
</body>
</html>`;
}
