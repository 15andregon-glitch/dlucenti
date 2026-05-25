import { formatPrice } from "@/lib/cart";
import { escapeHtml } from "@/lib/emails/escape-html";
import { getOrderEmailCopy } from "@/lib/emails/order-email-copy";
import type { OrderEmailPayload } from "@/lib/emails/order-email-types";
import type { Locale } from "@/lib/i18n/locale";

const STYLES = {
  body: "margin:0;padding:0;background-color:#f7f4ef;",
  wrap: "max-width:520px;margin:0 auto;padding:48px 28px 56px;",
  label:
    "font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#9a958c;margin:0 0 8px;",
  title:
    "font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;letter-spacing:-0.02em;line-height:1.15;color:#3a3834;margin:0 0 20px;",
  text: "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.75;color:#6e6a63;margin:0 0 16px;",
  rule: "border:none;border-top:1px solid rgba(58,56,52,0.1);margin:28px 0;",
  rowLabel:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#9a958c;padding:0 0 4px;",
  rowValue:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;line-height:1.6;",
  itemName:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;line-height:1.5;",
  itemMeta:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#9a958c;padding-top:2px;",
  total:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;",
  footer:
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.65;color:#9a958c;margin:32px 0 0;",
} as const;

function block(label: string, value: string): string {
  return `
    <tr>
      <td style="padding-bottom:20px;">
        <p style="${STYLES.rowLabel}">${escapeHtml(label)}</p>
        <p style="${STYLES.rowValue}">${value}</p>
      </td>
    </tr>`;
}

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
      return `
        <tr>
          <td style="padding:0 0 16px;">
            <p style="${STYLES.itemName}">${escapeHtml(item.name)}</p>
            <p style="${STYLES.itemMeta}">${escapeHtml(meta)}</p>
          </td>
        </tr>`;
    })
    .join("");

  return `
    <p style="${STYLES.label}">${escapeHtml(copy.itemsLabel)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px;">
      ${rows}
    </table>`;
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
      : "—";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="${STYLES.total};padding:4px 0;">${escapeHtml(copy.subtotalLabel)}</td>
        <td align="right" style="${STYLES.total};padding:4px 0;">${escapeHtml(formatPrice(payload.subtotal, payload.currency, locale))}</td>
      </tr>
      <tr>
        <td style="${STYLES.total};padding:4px 0;">${escapeHtml(copy.shippingLabel)}</td>
        <td align="right" style="${STYLES.total};padding:4px 0;">${escapeHtml(shippingDisplay)}</td>
      </tr>
      <tr>
        <td style="padding-top:12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;">${escapeHtml(copy.totalLabel)}</td>
        <td align="right" style="padding-top:12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#3a3834;">${escapeHtml(formatPrice(payload.total, payload.currency, locale))}</td>
      </tr>
    </table>`;
}

export function buildCustomerOrderEmailHtml(payload: OrderEmailPayload): string {
  const locale = payload.locale;
  const copy = getOrderEmailCopy(locale, "customer");

  const customerLine = [
    payload.customerName,
    payload.customerEmail,
  ]
    .filter(Boolean)
    .join(" · ");

  const addressBlock = payload.shippingAddress
    ? block(copy.shippingAddressLabel, formatMultiline(payload.shippingAddress))
    : "";

  const contactBlock = customerLine
    ? block(copy.customerLabel, escapeHtml(customerLine))
    : "";

  return `<!DOCTYPE html>
<html lang="${locale === "pt" ? "pt" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(copy.customerSubject)}</title>
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
              <p style="${STYLES.text}">${escapeHtml(copy.intro)}</p>
              <hr style="${STYLES.rule}" />
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                ${block(copy.orderNumberLabel, escapeHtml(payload.orderNumber))}
              </table>
              ${buildItemsHtml(payload, locale, "customer")}
              <hr style="${STYLES.rule}" />
              ${buildTotalsHtml(payload, locale, "customer")}
              <hr style="${STYLES.rule}" />
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                ${addressBlock}
                ${contactBlock}
              </table>
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

export function buildAdminOrderEmailHtml(payload: OrderEmailPayload): string {
  const locale = payload.locale;
  const copy = getOrderEmailCopy(locale, "admin");

  const customerBlock = block(
    copy.customerLabel,
    escapeHtml(
      [payload.customerName, payload.customerEmail].filter(Boolean).join(" · ") ||
        "—",
    ),
  );

  const addressBlock = payload.shippingAddress
    ? block(copy.shippingAddressLabel, formatMultiline(payload.shippingAddress))
    : "";

  return `<!DOCTYPE html>
<html lang="${locale === "pt" ? "pt" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(copy.adminSubject(payload.orderNumber))}</title>
</head>
<body style="${STYLES.body}">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="${STYLES.body}">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="${STYLES.wrap}">
          <tr>
            <td>
              <p style="${STYLES.label}">D'LUCENTI · Admin</p>
              <h1 style="${STYLES.title}">${escapeHtml(copy.adminTitle)}</h1>
              <p style="${STYLES.text}">${escapeHtml(copy.adminIntro)}</p>
              <hr style="${STYLES.rule}" />
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                ${block(copy.orderNumberLabel, escapeHtml(payload.orderNumber))}
                ${block("ID", escapeHtml(payload.orderId))}
                ${customerBlock}
                ${addressBlock}
              </table>
              ${buildItemsHtml(payload, locale, "admin")}
              <hr style="${STYLES.rule}" />
              ${buildTotalsHtml(payload, locale, "admin")}
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
