import { getShippingEmailCopy } from "@/lib/emails/shipping-email-copy";
import type { ShippingEmailPayload } from "@/lib/emails/shipping-email-types";

export function buildShippingConfirmationEmailText(
  payload: ShippingEmailPayload,
): string {
  const copy = getShippingEmailCopy(payload.locale);

  const lines: string[] = [
    "D'LUCENTI",
    "",
    copy.title,
    "",
  ];

  if (payload.customerName) {
    lines.push(`${payload.customerName},`, "");
  }

  lines.push(copy.intro, "", `${copy.orderLabel}: ${payload.orderNumber}`);

  if (payload.courier || payload.trackingNumber) {
    lines.push("", copy.trackingLabel);
    if (payload.courier) lines.push(payload.courier);
    if (payload.trackingNumber) lines.push(payload.trackingNumber);
  }

  if (payload.trackingUrl) {
    lines.push("", `${copy.trackCta}: ${payload.trackingUrl}`);
  }

  lines.push("", "---", copy.footer);

  return lines.join("\n");
}
