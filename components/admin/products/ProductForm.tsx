"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/admin/actions/products";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminCheckbox } from "@/components/admin/ui/AdminCheckbox";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { ProductFinanceSummary } from "@/components/admin/products/ProductFinanceSummary";
import { AdminTargetGenderField } from "@/components/admin/products/AdminTargetGenderField";
import type { ProductTargetGender } from "@/types/database/schema";
import type { ProductCategory } from "@/types/database/schema";
import { showOnStorefrontFromRow } from "@/lib/product-editorial-visibility";
import type { CollectionRow, ProductRow } from "@/types/database";
import type { ProductEconomicsInput } from "@/lib/finance/product-economics";
import { formatPriceInputValue, parsePriceInput } from "@/lib/prices";

const CATEGORIES: ProductCategory[] = [
  "rings",
  "necklaces",
  "earrings",
  "bracelets",
  "objects",
];

interface ProductFormProps {
  product?: ProductRow;
  collections: CollectionRow[];
}

function num(value: number | null | undefined, fallback = 0): number {
  return value ?? fallback;
}

function moneyInputValue(value: number | null | undefined): string {
  if (value == null) return "";
  return formatPriceInputValue(Number(value));
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isNew = !product;

  const [economicsInput, setEconomicsInput] = useState<ProductEconomicsInput>(() => ({
    sellingPrice: num(product?.price),
    productCost: num(product?.product_cost),
    packagingCost: num(product?.packaging_cost),
    pouchCost: num(product?.pouch_cost),
    shippingCost: num(product?.shipping_cost),
    importCost: num(product?.import_cost),
    paymentFeePercent: num(product?.payment_fee_percent, 2.9),
    vatRate: num(product?.vat_rate, 23),
    targetMarginPercent: product?.target_margin_percent ?? null,
  }));

  const [stock, setStock] = useState(num(product?.stock));
  const [minimumStock, setMinimumStock] = useState(num(product?.minimum_stock));

  const syncEconomics = (
    field: keyof ProductEconomicsInput,
    value: number | null,
  ) => {
    setEconomicsInput((prev) => ({
      ...prev,
      [field]: field === "targetMarginPercent" ? value : (value ?? 0),
    }));
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isNew
        ? await createProductAction(formData)
        : await updateProductAction(product!.id, formData);

      if (!result.ok) {
        alert(result.error);
        return;
      }

      if (isNew && "id" in result) {
        router.push(ADMIN_ROUTES.product(result.id as string));
      } else {
        router.refresh();
      }
    });
  };

  const sectionTitle = useMemo(
    () => "font-sans text-[0.6875rem] tracking-[0.12em] text-[var(--maison-mist)] uppercase",
    [],
  );

  return (
    <form action={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_minmax(17rem,22rem)]">
      <div className="space-y-12">
        <AdminPanel title="Product information">
          <div className="grid max-w-2xl gap-8">
            <AdminField label="Product name" htmlFor="name">
              <AdminInput id="name" name="name" required defaultValue={product?.name} />
            </AdminField>
            <AdminField label="Slug" htmlFor="slug">
              <AdminInput id="slug" name="slug" required defaultValue={product?.slug} />
            </AdminField>
            <AdminField label="Description" htmlFor="description">
              <AdminTextarea
                id="description"
                name="description"
                defaultValue={product?.description}
              />
            </AdminField>
            <AdminField label="Materials" htmlFor="materials">
              <AdminTextarea
                id="materials"
                name="materials"
                defaultValue={product?.materials}
                placeholder="18K gold, diamond…"
              />
            </AdminField>
            <AdminField label="Dimensions" htmlFor="dimensions">
              <AdminInput
                id="dimensions"
                name="dimensions"
                defaultValue={product?.dimensions}
                placeholder="Ring size, chain length…"
              />
            </AdminField>
            <AdminField label="Categoria" htmlFor="target_gender">
              <AdminTargetGenderField
                defaultValue={(product?.target_gender ?? "unisex") as ProductTargetGender}
              />
            </AdminField>
            <div className="grid gap-8 sm:grid-cols-2">
              <AdminField label="Collection" htmlFor="collection_id">
                <AdminSelect
                  id="collection_id"
                  name="collection_id"
                  defaultValue={product?.collection_id ?? ""}
                >
                  <option value="">None</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminField>
              <AdminField label="Piece type" htmlFor="category">
                <AdminSelect
                  id="category"
                  name="category"
                  defaultValue={product?.category ?? "rings"}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </AdminSelect>
              </AdminField>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Status">
          <AdminField label="Estado de publicação" htmlFor="publication_status">
            <AdminSelect
              id="publication_status"
              name="publication_status"
              defaultValue={product?.publication_status ?? "draft"}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </AdminSelect>
          </AdminField>
        </AdminPanel>

        <AdminPanel title="Visibilidade">
          <div className="grid max-w-2xl gap-6">
            <AdminCheckbox
              name="show_on_storefront"
              label="Mostrar na loja"
              defaultChecked={product ? showOnStorefrontFromRow(product) : true}
            />
            <AdminCheckbox
              name="show_on_homepage"
              label="Mostrar na homepage"
              defaultChecked={product?.featured ?? false}
            />
            <AdminCheckbox
              name="show_new_badge"
              label="Mostrar etiqueta Novidade"
              defaultChecked={product?.new_in ?? false}
            />
            <AdminCheckbox
              name="archived"
              label="Arquivado"
              defaultChecked={product?.archived ?? false}
            />
            <p className="font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
              Produtos esgotados permanecem visíveis e exibem a etiqueta
              &lsquo;Esgotado&rsquo;. A publicação exige preço de venda e custo do produto.
            </p>
          </div>
        </AdminPanel>

        <AdminPanel title="Pricing & financials">
          <p className={sectionTitle + " mb-6"}>Required for publish</p>
          <div className="grid max-w-2xl gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <AdminField label="Selling price (EUR)" htmlFor="price">
                <AdminInput
                  id="price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  required
                  placeholder="0,01"
                  defaultValue={moneyInputValue(product?.price)}
                  onChange={(e) =>
                    syncEconomics("sellingPrice", parsePriceInput(e.target.value))
                  }
                />
              </AdminField>
              <AdminField label="Product cost (EUR)" htmlFor="product_cost">
                <AdminInput
                  id="product_cost"
                  name="product_cost"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  required
                  placeholder="0,00"
                  defaultValue={moneyInputValue(product?.product_cost)}
                  onChange={(e) =>
                    syncEconomics("productCost", parsePriceInput(e.target.value))
                  }
                />
              </AdminField>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <AdminField label="Packaging cost" htmlFor="packaging_cost">
                <AdminInput
                  id="packaging_cost"
                  name="packaging_cost"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0,00"
                  defaultValue={moneyInputValue(product?.packaging_cost)}
                  onChange={(e) =>
                    syncEconomics("packagingCost", parsePriceInput(e.target.value))
                  }
                />
              </AdminField>
              <AdminField label="Pouch cost" htmlFor="pouch_cost">
                <AdminInput
                  id="pouch_cost"
                  name="pouch_cost"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0,00"
                  defaultValue={moneyInputValue(product?.pouch_cost)}
                  onChange={(e) =>
                    syncEconomics("pouchCost", parsePriceInput(e.target.value))
                  }
                />
              </AdminField>
              <AdminField label="Est. shipping cost" htmlFor="shipping_cost">
                <AdminInput
                  id="shipping_cost"
                  name="shipping_cost"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0,00"
                  defaultValue={moneyInputValue(product?.shipping_cost)}
                  onChange={(e) =>
                    syncEconomics("shippingCost", parsePriceInput(e.target.value))
                  }
                />
              </AdminField>
              <AdminField label="Import cost" htmlFor="import_cost">
                <AdminInput
                  id="import_cost"
                  name="import_cost"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0,00"
                  defaultValue={moneyInputValue(product?.import_cost)}
                  onChange={(e) =>
                    syncEconomics("importCost", parsePriceInput(e.target.value))
                  }
                />
              </AdminField>
              <AdminField label="Payment fee %" htmlFor="payment_fee_percent">
                <AdminInput
                  id="payment_fee_percent"
                  name="payment_fee_percent"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={product?.payment_fee_percent ?? 2.9}
                  onChange={(e) =>
                    syncEconomics("paymentFeePercent", Number(e.target.value))
                  }
                />
              </AdminField>
              <AdminField label="VAT rate %" htmlFor="vat_rate">
                <AdminInput
                  id="vat_rate"
                  name="vat_rate"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  defaultValue={product?.vat_rate ?? 23}
                  onChange={(e) => syncEconomics("vatRate", Number(e.target.value))}
                />
              </AdminField>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <AdminField label="Supplier name" htmlFor="supplier_name">
                <AdminInput
                  id="supplier_name"
                  name="supplier_name"
                  defaultValue={product?.supplier_name}
                />
              </AdminField>
              <AdminField label="Supplier reference" htmlFor="supplier_reference">
                <AdminInput
                  id="supplier_reference"
                  name="supplier_reference"
                  defaultValue={product?.supplier_reference}
                />
              </AdminField>
              <AdminField label="Target margin %" htmlFor="target_margin_percent">
                <AdminInput
                  id="target_margin_percent"
                  name="target_margin_percent"
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  defaultValue={product?.target_margin_percent ?? ""}
                  onChange={(e) =>
                    syncEconomics(
                      "targetMarginPercent",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </AdminField>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Inventory">
          <div className="grid max-w-2xl gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <AdminField label="SKU" htmlFor="sku">
                <AdminInput id="sku" name="sku" defaultValue={product?.sku ?? ""} />
              </AdminField>
              <AdminField label="Barcode" htmlFor="barcode">
                <AdminInput
                  id="barcode"
                  name="barcode"
                  defaultValue={product?.barcode ?? ""}
                />
              </AdminField>
              <AdminField label="Stock quantity" htmlFor="stock">
                <AdminInput
                  id="stock"
                  name="stock"
                  type="number"
                  min={0}
                  defaultValue={product?.stock ?? 0}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </AdminField>
              <AdminField label="Minimum stock" htmlFor="minimum_stock">
                <AdminInput
                  id="minimum_stock"
                  name="minimum_stock"
                  type="number"
                  min={0}
                  defaultValue={product?.minimum_stock ?? 0}
                  onChange={(e) => setMinimumStock(Number(e.target.value))}
                />
              </AdminField>
              <AdminField label="Reserved stock" htmlFor="reserved_stock">
                <AdminInput
                  id="reserved_stock"
                  name="reserved_stock"
                  type="number"
                  min={0}
                  defaultValue={product?.reserved_stock ?? 0}
                />
              </AdminField>
              <AdminField label="Lead time (days)" htmlFor="lead_time_days">
                <AdminInput
                  id="lead_time_days"
                  name="lead_time_days"
                  type="number"
                  min={0}
                  defaultValue={product?.lead_time_days ?? 0}
                />
              </AdminField>
            </div>
            <AdminField label="Warehouse location" htmlFor="warehouse_location">
              <AdminInput
                id="warehouse_location"
                name="warehouse_location"
                defaultValue={product?.warehouse_location}
              />
            </AdminField>
          </div>
        </AdminPanel>

        <AdminButton type="submit" variant="solid" disabled={pending} className="w-fit">
          {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </AdminButton>
      </div>

      <ProductFinanceSummary
        input={economicsInput}
        stock={stock}
        minimumStock={minimumStock}
      />
    </form>
  );
}
