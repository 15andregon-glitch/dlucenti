import "server-only";

import { getPacklinkApiBaseUrl, getPacklinkApiKey } from "@/lib/shipping/packlink-config";
import { PacklinkApiError } from "@/lib/shipping/packlink";

export interface PacklinkDropoffPoint {
  id: string;
  commerceName: string;
  address: string;
  city: string;
  zip: string;
  country: string | null;
  phone: string | null;
}

interface PacklinkApiDropoff {
  id?: string;
  commerce_name?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string | null;
  phone?: string | null;
}

/**
 * Packlink drop-off / pickup points for parcel-shop delivery services.
 * GET /v1/dropoffs/:service_id/:country/:zip
 */
export async function listPacklinkDropoffs(
  serviceId: string,
  country: string,
  zip: string,
): Promise<PacklinkDropoffPoint[]> {
  const apiKey = getPacklinkApiKey();
  if (!apiKey) return [];

  const baseUrl = getPacklinkApiBaseUrl().replace(/\/$/, "");
  const url = `${baseUrl}/v1/dropoffs/${encodeURIComponent(serviceId)}/${encodeURIComponent(country.toUpperCase())}/${encodeURIComponent(zip)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.warn("[packlink] dropoffs request failed", {
      serviceId,
      country,
      zip,
      status: response.status,
      body: body.slice(0, 300),
    });
    if (response.status === 404) return [];
    throw new PacklinkApiError(
      `Packlink dropoffs error (${response.status})`,
      response.status,
    );
  }

  const data = (await response.json()) as PacklinkApiDropoff[] | { data?: PacklinkApiDropoff[] };
  const items = Array.isArray(data) ? data : (data.data ?? []);

  return items
    .filter((d) => d.id && d.commerce_name)
    .map((d) => ({
      id: String(d.id),
      commerceName: String(d.commerce_name).trim(),
      address: (d.address ?? "").trim(),
      city: (d.city ?? "").trim(),
      zip: (d.zip ?? zip).trim(),
      country: d.country?.trim().toUpperCase() ?? country.toUpperCase(),
      phone: d.phone?.trim() ?? null,
    }));
}

export function formatPacklinkDropoffAddress(point: PacklinkDropoffPoint): string {
  const parts = [point.address, point.zip, point.city].filter(Boolean);
  return parts.join(", ");
}
