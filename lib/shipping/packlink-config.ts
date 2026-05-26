import "server-only";

import {
  DEFAULT_PACKAGE_DIMENSIONS_CM,
  DEFAULT_PACKAGE_WEIGHT_KG,
} from "@/lib/shipping/constants";

export interface PacklinkOrigin {
  country: string;
  zip: string;
  city: string;
}

export function getPacklinkApiKey(): string | null {
  const key = process.env.PACKLINK_API_KEY?.trim();
  return key || null;
}

export function isPacklinkConfigured(): boolean {
  return Boolean(getPacklinkApiKey());
}

export function getPacklinkApiBaseUrl(): string {
  const base = process.env.PACKLINK_API_BASE_URL?.trim();
  if (base) return base.replace(/\/$/, "");
  const sandbox = process.env.PACKLINK_SANDBOX === "true";
  return sandbox ? "https://apisandbox.packlink.com" : "https://api.packlink.com";
}

export function getPacklinkOrigin(): PacklinkOrigin {
  return {
    country: (process.env.PACKLINK_ORIGIN_COUNTRY ?? "PT").trim().toUpperCase(),
    zip: (process.env.PACKLINK_ORIGIN_ZIP ?? "1100-148").trim(),
    city: (process.env.PACKLINK_ORIGIN_CITY ?? "Lisboa").trim(),
  };
}

export function getDefaultPackage() {
  return {
    weight: DEFAULT_PACKAGE_WEIGHT_KG,
    width: DEFAULT_PACKAGE_DIMENSIONS_CM.width,
    height: DEFAULT_PACKAGE_DIMENSIONS_CM.height,
    length: DEFAULT_PACKAGE_DIMENSIONS_CM.length,
  };
}
