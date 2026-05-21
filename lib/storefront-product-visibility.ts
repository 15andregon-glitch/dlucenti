/** CMS storefront visibility — inventory/stock never affects these flags. */

import type { ProductRow } from "@/types/database";

export type StorefrontProductRow = Pick<
  ProductRow,
  "publication_status" | "active" | "hidden_from_frontend" | "archived"
>;

export function isMissingColumnError(
  error: { code?: string; message?: string } | null,
) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    /hidden_from_frontend|archived|does not exist/i.test(error.message ?? "")
  );
}

/**
 * Visible on storefront when published and not CMS-hidden.
 * Legacy rows without publication_status use active !== false.
 */
export function isStorefrontProductVisible(row: StorefrontProductRow): boolean {
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

export function filterStorefrontProducts<T extends StorefrontProductRow>(
  rows: T[],
): T[] {
  return rows.filter(isStorefrontProductVisible);
}
