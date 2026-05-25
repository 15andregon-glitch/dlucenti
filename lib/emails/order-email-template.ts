import { formatPrice } from "@/lib/cart";
import { escapeHtml } from "@/lib/emails/escape-html";
import { getOrderEmailCopy } from "@/lib/emails/order-email-copy";
import type { OrderEmailPayload } from "@/lib/emails/order-email-types";
import type { Locale } from "@/lib/i18n/locale";

const BODY =
  "margin:0;padding:0;background:#f7f4ef;font-family:Georgia,'Times New Roman',serif;color:#3a3834;";
const MAIN = "max-width:520px;margin:0 auto;padding:32px 24px 40px;";
const P = "font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#5c5852;margin:0 0 14px;";
const H1 = "font-size:20px;font-weight:400;line-height:1.3;margin:0 0 16px;color:#3a3834;";
const LABEL = "font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a958c;margin:24px 0 8px;";
const HR = "border:0;border-top:1px solid #e5e1da;margin:24px 0;";
const FOOTER_NOTICE =
  "font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#b5b0a8;margin:28px 0 10px;";
const FOOTER = "font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9a958c;margin:0;";

function formatMultiline(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

function buildItemsHtml(
  payload: OrderEmailPayload,
  locale: Locale,
  kind: "customer" | "admin",
): string {
  const copy = getOrderEmailCopy(locale, kind);
  const rows = payload.items
    .map((item) => {
      const meta = `${copy.qty} ${item.quantity} · ${formatPrice(item.lineTotal, payload.currency, locale)}`;
      return `<li style="${P}"><strong>${escapeHtml(item.name)}</strong><br /><span style="color:#9a958c;font-size:13px;">${escapeHtml(meta)}</span></li>`;
    })
    .join("");

  return `<p style="${LABEL}">${escapeHtml(copy.itemsLabel)}</p><ul style="margin:0;padding:0 0 0 18px;">${rows}</ul>`;
}

function buildTotalsHtml(
  payload: OrderEmailPayload,
  locale: Locale,
  kind: "customer" | "admin",
): string {
  const copy = getOrderEmailCopy(locale, kind);
  const shippingDisplay =
    payload.shippingCost > 0
      ? formatPrice(payload.shippingCost, payload.currency, locale)
      : copy.complimentaryShipping;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;">
      <tr><td style="padding:4px 0;">${escapeHtml(copy.subtotalLabel)}</td><td align="right" style="padding:4px 0;">${escapeHtml(formatPrice(payload.subtotal, payload.currency, locale))}</td></tr>
      <tr><td style="padding:4px 0;">${escapeHtml(copy.shippingLabel)}</td><td align="right" style="padding:4px 0;">${escapeHtml(shippingDisplay)}</td></tr>
      <tr><td style="padding:10px 0 4px;font-weight:600;">${escapeHtml(copy.totalLabel)}</td><td align="right" style="padding:10px 0 4px;font-weight:600;">${escapeHtml(formatPrice(payload.total, payload.currency, locale))}</td></tr>
    </table>`;
}

function emailShell(
  locale: Locale,
  title: string,
  preheader: string,
  body: string,
): string {
  const lang = locale === "pt" ? "pt" : "en";
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(title)}</title>
</head>
<body style="${BODY}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<main style="${MAIN}">
${body}
</main>
</body>
</html>`;
}

export function buildCustomerOrderEmailHtml(payload: OrderEmailPayload): string {
  const locale = payload.locale;
  const copy = getOrderEmailCopy(locale, "customer");

  const customerLine = [payload.customerName, payload.customerEmail]
    .filter((v): v is string => Boolean(v))
    .map(escapeHtml)
    .join(" · ");

  const addressSection = payload.shippingAddress
    ? `<p style="${LABEL}">${escapeHtml(copy.shippingAddressLabel)}</p><p style="${P}">${formatMultiline(payload.shippingAddress)}</p>`
    : "";

  const contactSection = customerLine
    ? `<p style="${LABEL}">${escapeHtml(copy.customerLabel)}</p><p style="${P}">${customerLine}</p>`
    : "";

  const body = `
<p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a958c;margin:0 0 12px;">D'LUCENTI</p>
<h1 style="${H1}">${escapeHtml(copy.title)}</h1>
<p style="${P}">${escapeHtml(copy.intro)}</p>
<hr style="${HR}" />
<p style="${P}"><span style="color:#9a958c;">${escapeHtml(copy.orderNumberLabel)}:</span> ${escapeHtml(payload.orderNumber)}</p>
${buildItemsHtml(payload, locale, "customer")}
<hr style="${HR}" />
${buildTotalsHtml(payload, locale, "customer")}
<hr style="${HR}" />
${addressSection}
${contactSection}
${copy.inboxNotice ? `<p style="${FOOTER_NOTICE}">${escapeHtml(copy.inboxNotice)}</p>` : ""}
<p style="${FOOTER}">${escapeHtml(copy.footer)}</p>`;

  return emailShell(
    locale,
    copy.customerSubject(payload.orderNumber),
    copy.preheader(payload.orderNumber),
    body,
  );
}

export function buildAdminOrderEmailHtml(payload: OrderEmailPayload): string {
  const locale = payload.locale;
  const copy = getOrderEmailCopy(locale, "admin");

  const customerLine = escapeHtml(
    [payload.customerName, payload.customerEmail].filter(Boolean).join(" · ") ||
      "—",
  );

  const addressSection = payload.shippingAddress
    ? `<p style="${LABEL}">${escapeHtml(copy.shippingAddressLabel)}</p><p style="${P}">${formatMultiline(payload.shippingAddress)}</p>`
    : "";

  const body = `
<p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a958c;margin:0 0 12px;">D'LUCENTI</p>
<h1 style="${H1}">${escapeHtml(copy.adminTitle)}</h1>
<p style="${P}">${escapeHtml(copy.adminIntro)}</p>
<hr style="${HR}" />
<p style="${P}"><span style="color:#9a958c;">${escapeHtml(copy.orderNumberLabel)}:</span> ${escapeHtml(payload.orderNumber)}</p>
<p style="${P}"><span style="color:#9a958c;">ID:</span> ${escapeHtml(payload.orderId)}</p>
<p style="${P}"><span style="color:#9a958c;">${escapeHtml(copy.customerLabel)}:</span> ${customerLine}</p>
${addressSection}
${buildItemsHtml(payload, locale, "admin")}
<hr style="${HR}" />
${buildTotalsHtml(payload, locale, "admin")}
<p style="${FOOTER}">${escapeHtml(copy.footer)}</p>`;

  return emailShell(
    locale,
    copy.adminSubject(payload.orderNumber),
    copy.preheader(payload.orderNumber),
    body,
  );
}
