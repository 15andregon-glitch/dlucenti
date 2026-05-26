import "server-only";

import { getDefaultPackage, getPacklinkApiBaseUrl, getPacklinkApiKey, getPacklinkOrigin } from "@/lib/shipping/packlink-config";

export interface PacklinkShipmentRecipient {
  name: string;
  email?: string | null;
  phone?: string | null;
  country: string;
  postalCode: string;
  city: string;
  addressLine1: string;
  addressLine2?: string | null;
  state?: string | null;
}

export interface CreatePacklinkShipmentInput {
  orderNumber: string;
  serviceId: string;
  recipient: PacklinkShipmentRecipient;
}

export interface PacklinkShipmentResult {
  shipmentId: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  labelUrl: string | null;
  status: string | null;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

async function packlinkFetch(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const apiKey = getPacklinkApiKey();
  if (!apiKey) {
    throw new Error("PACKLINK_API_KEY is not configured");
  }
  const base = getPacklinkApiBaseUrl().replace(/\/$/, "");
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: apiKey,
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function createPacklinkShipment(
  input: CreatePacklinkShipmentInput,
): Promise<PacklinkShipmentResult> {
  const origin = getPacklinkOrigin();
  const parcel = getDefaultPackage();
  const serviceIdNum = Number(input.serviceId);

  const payload = {
    reference: input.orderNumber,
    service_id: Number.isFinite(serviceIdNum) ? serviceIdNum : input.serviceId,
    sender: {
      name: "D'LUCENTI",
      email: process.env.PACKLINK_SENDER_EMAIL ?? "orders@dlucenti.com",
      phone: process.env.PACKLINK_SENDER_PHONE ?? "",
      address: {
        country: origin.country,
        postal_code: origin.zip,
        city: origin.city,
        line_1: process.env.PACKLINK_ORIGIN_ADDRESS_LINE1 ?? "Rua Augusta",
        line_2: process.env.PACKLINK_ORIGIN_ADDRESS_LINE2 ?? "",
      },
    },
    recipient: {
      name: input.recipient.name,
      email: input.recipient.email ?? "",
      phone: input.recipient.phone ?? "",
      address: {
        country: input.recipient.country,
        postal_code: input.recipient.postalCode,
        city: input.recipient.city,
        state: input.recipient.state ?? "",
        line_1: input.recipient.addressLine1,
        line_2: input.recipient.addressLine2 ?? "",
      },
    },
    parcels: [
      {
        weight: parcel.weight,
        width: parcel.width,
        height: parcel.height,
        length: parcel.length,
      },
    ],
  };

  const response = await packlinkFetch("/v1/shipments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Packlink shipment creation failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const raw = (await response.json()) as Record<string, unknown>;
  const shipmentId = pickString(raw, ["id", "shipment_id"]);
  if (!shipmentId) {
    throw new Error("Packlink shipment created but no shipment id was returned");
  }

  const trackingNumber = pickString(raw, ["tracking_number", "trackingCode", "tracking"]);
  const trackingUrl = pickString(raw, ["tracking_url", "trackingUrl"]);
  const labelUrl = pickString(raw, ["label_url", "labelUrl", "label_pdf_url"]);
  const status = pickString(raw, ["status", "shipping_status"]);

  return { shipmentId, trackingNumber, trackingUrl, labelUrl, status };
}

export async function fetchPacklinkLabelDocument(
  shipmentId: string,
): Promise<{ url?: string; pdfBytes?: Uint8Array }> {
  const endpoints = [
    `/v1/shipments/${shipmentId}/label`,
    `/v1/shipments/${shipmentId}/labels`,
  ];

  for (const endpoint of endpoints) {
    const response = await packlinkFetch(endpoint, { method: "GET" });
    if (!response.ok) continue;

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType.includes("application/pdf")) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      return { pdfBytes: bytes };
    }

    const json = (await response.json().catch(() => null)) as
      | Record<string, unknown>
      | null;
    if (!json) continue;

    const url = pickString(json, ["label_url", "labelUrl", "url", "pdf_url"]);
    if (url) return { url };
  }

  return {};
}
