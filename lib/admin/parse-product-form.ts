import type {
  ProductCategory,
  ProductPublicationStatus,
  ProductTargetGender,
} from "@/types/database/schema";
import {
  computeProductEconomics,
  validateProductForPublish,
  type ProductEconomicsInput,
} from "@/lib/finance/product-economics";
import { parseCheckbox, parseNumber, parseOptionalUuid } from "@/lib/admin/utils";

export interface ParsedProductForm {
  name: string;
  slug: string;
  description: string;
  materials: string;
  dimensions: string;
  price: number;
  category: ProductCategory;
  target_gender: ProductTargetGender;
  stock: number;
  featured: boolean;
  new_in: boolean;
  active: boolean;
  publication_status: ProductPublicationStatus;
  hidden_from_frontend: boolean;
  archived: boolean;
  collection_id: string | null;
  product_cost: number;
  packaging_cost: number;
  pouch_cost: number;
  shipping_cost: number;
  payment_fee_percent: number;
  import_cost: number;
  vat_rate: number;
  supplier_name: string;
  supplier_reference: string;
  target_margin_percent: number | null;
  sku: string | null;
  barcode: string | null;
  minimum_stock: number;
  reserved_stock: number;
  lead_time_days: number;
  warehouse_location: string;
  total_cost: number;
  gross_margin_percent: number;
  estimated_net_profit: number;
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseProductForm(formData: FormData): ParsedProductForm {
  const economicsInput: ProductEconomicsInput = {
    sellingPrice: parseNumber(formData.get("price")),
    productCost: parseNumber(formData.get("product_cost")),
    packagingCost: parseNumber(formData.get("packaging_cost")),
    pouchCost: parseNumber(formData.get("pouch_cost")),
    shippingCost: parseNumber(formData.get("shipping_cost")),
    importCost: parseNumber(formData.get("import_cost")),
    paymentFeePercent: parseNumber(formData.get("payment_fee_percent"), 2.9),
    vatRate: parseNumber(formData.get("vat_rate"), 23),
    targetMarginPercent: parseOptionalNumber(formData.get("target_margin_percent")),
  };

  const economics = computeProductEconomics(economicsInput);
  const publication_status = (
    String(formData.get("publication_status") ?? "draft") === "published"
      ? "published"
      : "draft"
  ) as ProductPublicationStatus;

  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    materials: String(formData.get("materials") ?? ""),
    dimensions: String(formData.get("dimensions") ?? ""),
    price: economicsInput.sellingPrice,
    category: String(formData.get("category") ?? "rings") as ProductCategory,
    target_gender: (() => {
      const raw = String(formData.get("target_gender") ?? "unisex");
      if (raw === "women" || raw === "men" || raw === "unisex") return raw;
      return "unisex";
    })() as ProductTargetGender,
    stock: parseNumber(formData.get("stock")),
    featured: parseCheckbox(formData.get("featured")),
    new_in: parseCheckbox(formData.get("new_in")),
    hidden_from_frontend: parseCheckbox(formData.get("hidden_from_frontend")),
    archived: parseCheckbox(formData.get("archived")),
    active: false,
    publication_status,
    collection_id: parseOptionalUuid(formData.get("collection_id")),
    product_cost: economicsInput.productCost,
    packaging_cost: economicsInput.packagingCost,
    pouch_cost: economicsInput.pouchCost,
    shipping_cost: economicsInput.shippingCost,
    payment_fee_percent: economicsInput.paymentFeePercent,
    import_cost: economicsInput.importCost,
    vat_rate: economicsInput.vatRate,
    supplier_name: String(formData.get("supplier_name") ?? "").trim(),
    supplier_reference: String(formData.get("supplier_reference") ?? "").trim(),
    target_margin_percent: economicsInput.targetMarginPercent ?? null,
    sku: String(formData.get("sku") ?? "").trim() || null,
    barcode: String(formData.get("barcode") ?? "").trim() || null,
    minimum_stock: parseNumber(formData.get("minimum_stock")),
    reserved_stock: parseNumber(formData.get("reserved_stock")),
    lead_time_days: parseNumber(formData.get("lead_time_days")),
    warehouse_location: String(formData.get("warehouse_location") ?? "").trim(),
    total_cost: economics.totalCost,
    gross_margin_percent: economics.grossMarginPercent,
    estimated_net_profit: economics.estimatedNetProfit,
  };
}

/** Sync legacy active flag; storefront uses publication + hidden + archived. */
export function withStorefrontActiveFlag(
  row: ParsedProductForm,
): ParsedProductForm {
  const visible =
    row.publication_status === "published" &&
    !row.hidden_from_frontend &&
    !row.archived;
  return { ...row, active: visible };
}

export function validateProductForm(row: ParsedProductForm): string | null {
  if (!row.name) return "Name is required";
  if (!row.slug) return "Slug is required";
  if (row.price < 0 || row.product_cost < 0) return "Values cannot be negative";

  if (row.publication_status === "published") {
    return validateProductForPublish({
      sellingPrice: row.price,
      productCost: row.product_cost,
      packagingCost: row.packaging_cost,
      pouchCost: row.pouch_cost,
      shippingCost: row.shipping_cost,
      importCost: row.import_cost,
      paymentFeePercent: row.payment_fee_percent,
      vatRate: row.vat_rate,
      targetMarginPercent: row.target_margin_percent,
    });
  }

  return null;
}
