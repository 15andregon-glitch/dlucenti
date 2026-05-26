import "server-only";

import { roundMoney } from "@/lib/prices";
import {
  getDefaultPackage,
  getPacklinkApiBaseUrl,
  getPacklinkApiKey,
  getPacklinkOrigin,
  type PacklinkOrigin,
} from "@/lib/shipping/packlink-config";

export interface PacklinkAddress {
  country: string;
  zip: string;
}

export interface PacklinkPackage {
  weight: number;
  width: number;
  height: number;
  length: number;
}

export interface PacklinkQuoteRequest {
  from: PacklinkOrigin;
  to: PacklinkAddress;
  packages: PacklinkPackage[];
}

export interface PacklinkServiceQuote {
  serviceId: string;
  carrierName: string;
  serviceName: string;
  totalPrice: number;
  currency: string;
  transitHours?: string;
  /** Customer collects parcel at a pickup point / parcel shop */
  deliveryToParcelshop: boolean;
  /** Sender can drop off at a parcel shop */
  dropoff: boolean;
}

interface PacklinkApiPrice {
  total_price?: number;
  currency?: string;
}

interface PacklinkApiService {
  id?: number | string;
  carrier_name?: string;
  name?: string;
  price?: PacklinkApiPrice;
  transit_hours?: string;
  delivery_to_parcelshop?: boolean;
  dropoff?: boolean;
}

export class PacklinkApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PacklinkApiError";
    this.status = status;
  }
}

function buildServicesQuery(params: PacklinkQuoteRequest): string {
  const search = new URLSearchParams();
  const { from, to, packages } = params;

  search.set("from[country]", from.country);
  search.set("from[zip]", from.zip);
  if (from.city) search.set("from[city]", from.city);

  search.set("to[country]", to.country);
  search.set("to[zip]", to.zip);

  packages.forEach((pkg, index) => {
    search.set(`packages[${index}][weight]`, String(pkg.weight));
    search.set(`packages[${index}][width]`, String(pkg.width));
    search.set(`packages[${index}][height]`, String(pkg.height));
    search.set(`packages[${index}][length]`, String(pkg.length));
  });

  return search.toString();
}

function parseService(service: PacklinkApiService): PacklinkServiceQuote | null {
  const total = service.price?.total_price;
  if (total == null || !Number.isFinite(total) || total < 0) return null;

  const id = service.id;
  if (id == null) return null;

  return {
    serviceId: String(id),
    carrierName: (service.carrier_name ?? "Carrier").trim(),
    serviceName: (service.name ?? "Standard").trim(),
    totalPrice: roundMoney(total),
    currency: (service.price?.currency ?? "EUR").toUpperCase(),
    transitHours: service.transit_hours,
    deliveryToParcelshop: Boolean(service.delivery_to_parcelshop),
    dropoff: Boolean(service.dropoff),
  };
}

function sortServices(services: PacklinkServiceQuote[]): PacklinkServiceQuote[] {
  return [...services].sort((a, b) => {
    if (a.deliveryToParcelshop !== b.deliveryToParcelshop) {
      return a.deliveryToParcelshop ? 1 : -1;
    }
    return a.totalPrice - b.totalPrice;
  });
}

/**
 * Packlink PRO services API — quotes only (no label purchase).
 * Services with delivery_to_parcelshop support pickup-point delivery.
 * @see https://docs.packlink.com
 */
export class PacklinkClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    const key = apiKey ?? getPacklinkApiKey();
    if (!key) {
      throw new Error("PACKLINK_API_KEY is not configured");
    }
    this.apiKey = key;
    this.baseUrl = (baseUrl ?? getPacklinkApiBaseUrl()).replace(/\/$/, "");
  }

  static tryCreate(): PacklinkClient | null {
    const key = getPacklinkApiKey();
    if (!key) return null;
    return new PacklinkClient(key);
  }

  async getCheapestQuote(
    to: PacklinkAddress,
    packages?: PacklinkPackage[],
  ): Promise<PacklinkServiceQuote> {
    const quotes = await this.listServiceQuotes({
      from: getPacklinkOrigin(),
      to,
      packages: packages ?? [getDefaultPackage()],
    });
    const homeQuotes = quotes.filter((q) => !q.deliveryToParcelshop);
    const pool = homeQuotes.length > 0 ? homeQuotes : quotes;
    if (pool.length === 0) {
      throw new PacklinkApiError("No Packlink services available for this route", 404);
    }
    return pool.reduce((best, current) =>
      current.totalPrice < best.totalPrice ? current : best,
    );
  }

  async listServiceQuotes(request: PacklinkQuoteRequest): Promise<PacklinkServiceQuote[]> {
    const query = buildServicesQuery(request);
    const url = `${this.baseUrl}/v1/services?${query}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[packlink] services request failed", {
        status: response.status,
        body: body.slice(0, 500),
      });
      throw new PacklinkApiError(
        `Packlink API error (${response.status})`,
        response.status,
      );
    }

    const data = (await response.json()) as PacklinkApiService[] | { data?: PacklinkApiService[] };
    const services = Array.isArray(data) ? data : (data.data ?? []);

    return sortServices(
      services
        .map(parseService)
        .filter((q): q is PacklinkServiceQuote => q != null),
    );
  }
}
