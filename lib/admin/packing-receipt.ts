import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface PackingReceiptItem {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface PackingReceiptInput {
  orderNumber: string;
  orderDateIso: string;
  customerName: string;
  shippingAddress: string;
  shippingMethod: string;
  currency: string;
  subtotal: number;
  customerShippingPaid: number;
  totalPaid: number;
  items: PackingReceiptItem[];
}

function money(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function buildPackingReceiptPdf(input: PackingReceiptInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const left = 50;
  let y = 790;

  page.drawText("D'LUCENTI", {
    x: left,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 28;

  page.drawText("Packing Receipt", { x: left, y, size: 12, font: font, color: rgb(0.3, 0.3, 0.3) });
  y -= 28;

  const summaryLines = [
    `Order: ${input.orderNumber}`,
    `Date: ${new Date(input.orderDateIso).toLocaleDateString("en-GB")}`,
    `Customer: ${input.customerName}`,
    `Shipping method: ${input.shippingMethod}`,
  ];

  for (const line of summaryLines) {
    page.drawText(line, { x: left, y, size: 10.5, font });
    y -= 16;
  }

  y -= 4;
  page.drawText("Shipping address", { x: left, y, size: 10.5, font: fontBold });
  y -= 16;
  for (const line of input.shippingAddress.split("\n")) {
    page.drawText(line.trim(), { x: left, y, size: 10, font });
    y -= 14;
  }

  y -= 10;
  page.drawText("Items", { x: left, y, size: 10.5, font: fontBold });
  y -= 16;

  page.drawText("Product", { x: left, y, size: 9.5, font: fontBold });
  page.drawText("SKU", { x: 295, y, size: 9.5, font: fontBold });
  page.drawText("Qty", { x: 390, y, size: 9.5, font: fontBold });
  page.drawText("Unit", { x: 440, y, size: 9.5, font: fontBold });
  y -= 14;

  for (const item of input.items) {
    page.drawText(item.name.slice(0, 42), { x: left, y, size: 9.5, font });
    page.drawText(item.sku.slice(0, 16), { x: 295, y, size: 9.5, font });
    page.drawText(String(item.quantity), { x: 395, y, size: 9.5, font });
    page.drawText(money(item.unitPrice, input.currency), { x: 440, y, size: 9.5, font });
    y -= 14;
  }

  y -= 18;
  const totals = [
    `Subtotal: ${money(input.subtotal, input.currency)}`,
    `Shipping paid: ${money(input.customerShippingPaid, input.currency)}`,
    `Total paid: ${money(input.totalPaid, input.currency)}`,
  ];
  for (const line of totals) {
    page.drawText(line, { x: left, y, size: 10.5, font: fontBold });
    y -= 16;
  }

  y -= 20;
  page.drawText("Thank you for choosing D'LUCENTI.", { x: left, y, size: 10, font });
  page.drawText("Prepared with care in Portugal.", { x: left, y: y - 14, size: 10, font });

  return pdf.save();
}
