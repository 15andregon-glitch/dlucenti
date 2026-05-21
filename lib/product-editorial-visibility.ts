/**
 * D'LUCENTI product visibility — editorial CMS semantics.
 *
 * Storefront visible when: published + not archived + show_on_storefront.
 * Homepage row when: storefront visible + show_on_homepage (DB: featured).
 * Novidade badge when: show_new_badge (DB: new_in), unless sold out.
 * Stock never hides products; stock <= 0 → Esgotado + disabled cart only.
 *
 * DB mapping (backward compatible):
 * - show_on_storefront  ↔ hidden_from_frontend (inverted)
 * - show_on_homepage    ↔ featured
 * - show_new_badge      ↔ new_in (visual only)
 * - archived            ↔ archived
 */

import type { ProductRow } from "@/types/database";
import type { Product } from "@/lib/types";
import { isProductSoldOut } from "@/lib/product-availability";

export type ProductVisibilityRow = Pick<
  ProductRow,
  "publication_status" | "active" | "hidden_from_frontend" | "archived" | "featured"
>;

/** Storefront: published, not hidden, not archived. Stock never affects this. */
export function isStorefrontProductVisible(row: ProductVisibilityRow): boolean {
  if (row.archived === true) return false;
  if (row.hidden_from_frontend === true) return false;

  const status = row.publication_status;
  if (status === "draft") return false;
  if (status === "published") return true;

  if (status == null || status === "") {
    return row.active !== false;
  }

  return false;
}

/** Homepage New In row: must be storefront-visible and flagged for homepage. */
export function isHomepageProductVisible(row: ProductVisibilityRow): boolean {
  return isStorefrontProductVisible(row) && row.featured === true;
}

export function filterStorefrontProducts<T extends ProductVisibilityRow>(
  rows: T[],
): T[] {
  return rows.filter(isStorefrontProductVisible);
}

export function filterHomepageProducts<T extends ProductVisibilityRow>(
  rows: T[],
): T[] {
  return rows.filter(isHomepageProductVisible);
}

/** CMS checkbox "Mostrar na loja" (checked = visible). */
export function showOnStorefrontFromRow(
  row: Pick<ProductRow, "hidden_from_frontend">,
): boolean {
  return row.hidden_from_frontend !== true;
}

export function hiddenFromFrontendFromShowOnStorefront(
  showOnStorefront: boolean,
): boolean {
  return !showOnStorefront;
}

/** Badge priority: Esgotado → Novidade (never both). */
export function resolveProductEditorialBadge(
  product: Pick<Product, "stock" | "isNew">,
  labels: { soldOut: string; newIn: string },
): { label: string; variant: "new" | "soldOut" } | null {
  if (isProductSoldOut(product)) {
    return { label: labels.soldOut, variant: "soldOut" };
  }
  if (product.isNew) {
    return { label: labels.newIn, variant: "new" };
  }
  return null;
}
