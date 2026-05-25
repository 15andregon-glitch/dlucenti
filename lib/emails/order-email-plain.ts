import { formatPrice } from "@/lib/cart";
import { getOrderEmailCopy } from "@/lib/emails/order-email-copy";
import type { OrderEmailPayload } from "@/lib/emails/order-email-types";
import type { Locale } from "@/lib/i18n/locale";

function formatMultiline(text: string): string {
  return text.trim();
}

function buildItemsText(
  payload: OrderEmailPayload,
  locale: Locale,
  kind: "customer" | "admin",
): string {
  const copy = getOrderEmailCopy(locale, kind);
  const lines = payload.items.map((item) => {
    const lineTotal = formatPrice(item.lineTotal, payload.currency, locale);
    return `- ${item.name} (${copy.qty} ${item.quantity}) — ${lineTotal}`;
  });
  return `${copy.itemsLabel}\n${lines.join("\n")}`;
}

function buildTotalsText(
  payload: OrderEmailPayload,
  locale: Locale,
  kind: "customer" | "admin",
): string {
  const copy = getOrderEmailCopy(locale, kind);
  const shippingDisplay =
    payload.shippingCost > 0
      ? formatPrice(payload.shippingCost, payload.currency, locale)
      : copy.complimentaryShipping;

  return [
    `${copy.subtotalLabel}: ${formatPrice(payload.subtotal, payload.currency, locale)}`,
    `${copy.shippingLabel}: ${shippingDisplay}`,
    `${copy.totalLabel}: ${formatPrice(payload.total, payload.currency, locale)}`,
  ].join("\n");
}

export function buildCustomerOrderEmailText(payload: OrderEmailPayload): string {
  const locale = payload.locale;
  const copy = getOrderEmailCopy(locale, "customer");

  const sections: string[] = [
    "D'LUCENTI",
    "",
    copy.title,
    "",
    copy.intro,
    "",
    `${copy.orderNumberLabel}: ${payload.orderNumber}`,
    "",
    buildItemsText(payload, locale, "customer"),
    "",
    buildTotalsText(payload, locale, "customer"),
  ];

  if (payload.shippingAddress) {
    sections.push(
      "",
      copy.shippingAddressLabel,
      formatMultiline(payload.shippingAddress),
    );
  }

  const contact = [payload.customerName, payload.customerEmail]
    .filter(Boolean)
    .join(" — ");
  if (contact) {
    sections.push("", copy.customerLabel, contact);
  }

  if (copy.inboxNotice) {
    sections.push("", copy.inboxNotice);
  }

  sections.push("", "---", copy.footer);

  return sections.join("\n");
}

export function buildAdminOrderEmailText(payload: OrderEmailPayload): string {
  const locale = payload.locale;
  const copy = getOrderEmailCopy(locale, "admin");

  const customer = [payload.customerName, payload.customerEmail]
    .filter(Boolean)
    .join(" — ");

  const sections: string[] = [
    "D'LUCENTI",
    "",
    copy.adminTitle,
    "",
    copy.adminIntro,
    "",
    `${copy.orderNumberLabel}: ${payload.orderNumber}`,
    `ID: ${payload.orderId}`,
    customer ? `${copy.customerLabel}: ${customer}` : "",
    payload.shippingAddress
      ? `${copy.shippingAddressLabel}:\n${formatMultiline(payload.shippingAddress)}`
      : "",
    "",
    buildItemsText(payload, locale, "admin"),
    "",
    buildTotalsText(payload, locale, "admin"),
    "",
    "---",
    copy.footer,
  ].filter(Boolean);

  return sections.join("\n");
}
