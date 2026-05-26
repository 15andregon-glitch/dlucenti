import "server-only";

import { isProductPurchasable } from "@/lib/product-availability";
import { isRingProduct, RING_VARIANT_TYPE } from "@/lib/product-variants";
import { isValidStripeUnitPrice, roundMoney } from "@/lib/prices";
import { isStorefrontProductVisible } from "@/lib/product-editorial-visibility";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fetchVariantById } from "@/queries/product-variants";
import { PRODUCT_SELECT } from "@/queries/products";
import type { CheckoutCartLineInput, ValidatedCheckoutCart } from "./types";
import type { ProductWithCollection } from "@/types/database";

export class CheckoutValidationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "EMPTY_CART"
      | "INVALID_ITEM"
      | "NOT_FOUND"
      | "NOT_VISIBLE"
      | "SOLD_OUT"
      | "INSUFFICIENT_STOCK"
      | "INVALID_PRICE"
      | "SIZE_REQUIRED"
      | "CONFIG",
  ) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

function lineMergeKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

function normalizeLines(
  items: CheckoutCartLineInput[],
): CheckoutCartLineInput[] {
  const merged = new Map<string, number>();

  for (const item of items) {
    const productId = item.productId?.trim();
    const variantId = item.variantId?.trim() || undefined;
    const quantity = Math.floor(Number(item.quantity));
    if (!productId || quantity <= 0) continue;
    const key = lineMergeKey(productId, variantId);
    merged.set(key, (merged.get(key) ?? 0) + quantity);
  }

  return [...merged.entries()].map(([key, quantity]) => {
    const [productId, variantId] = key.includes(":")
      ? (key.split(":") as [string, string])
      : [key, undefined];
    return { productId, quantity, variantId };
  });
}

export async function validateCheckoutCart(
  items: CheckoutCartLineInput[],
): Promise<ValidatedCheckoutCart> {
  const lines = normalizeLines(items);
  if (lines.length === 0) {
    throw new CheckoutValidationError("Cart is empty", "EMPTY_CART");
  }

  let client;
  try {
    client = createSupabaseAdminClient();
  } catch {
    throw new CheckoutValidationError(
      "Checkout is not configured",
      "CONFIG",
    );
  }

  const ids = [...new Set(lines.map((l) => l.productId))];
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", ids);

  if (error) {
    console.error("[checkout] product fetch failed", error.message);
    throw new CheckoutValidationError("Unable to validate cart", "CONFIG");
  }

  const byId = new Map(
    (data ?? []).map((row) => [row.id, row as ProductWithCollection]),
  );

  const validated: ValidatedCheckoutCart["lines"] = [];
  let subtotal = 0;

  for (const line of lines) {
    const row = byId.get(line.productId);
    if (!row) {
      throw new CheckoutValidationError(
        `Product not found: ${line.productId}`,
        "NOT_FOUND",
      );
    }

    if (!isStorefrontProductVisible(row)) {
      throw new CheckoutValidationError(
        `Product not available: ${row.name}`,
        "NOT_VISIBLE",
      );
    }

    const isRing = isRingProduct({ category: row.category });

    if (isRing && !line.variantId) {
      throw new CheckoutValidationError(
        `Ring size required for ${row.name}`,
        "SIZE_REQUIRED",
      );
    }

    if (!isRing && line.variantId) {
      throw new CheckoutValidationError(
        `Invalid cart line for ${row.name}`,
        "INVALID_ITEM",
      );
    }

    const product = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: roundMoney(Number(row.price)),
      currency: "EUR",
      category: row.category,
      targetGender: row.target_gender ?? "unisex",
      images: (row.product_images ?? [])
        .sort((a, b) => a.position - b.position)
        .map((img) => img.image_url),
      stock: Number(row.stock ?? 0),
    };

    let variantId: string | undefined;
    let variantType: string | undefined;
    let variantLabel: string | undefined;
    let variantSku: string | null | undefined;
    let availableStock = Math.max(0, Number(row.stock ?? 0));

    if (isRing) {
      const variantRow = line.variantId
        ? await fetchVariantById(client, line.variantId)
        : null;

      if (
        !variantRow ||
        variantRow.product_id !== row.id ||
        variantRow.variant_type !== RING_VARIANT_TYPE
      ) {
        throw new CheckoutValidationError(
          `Invalid ring size for ${row.name}`,
          "INVALID_ITEM",
        );
      }

      if (!variantRow.is_active) {
        throw new CheckoutValidationError(
          `Ring size unavailable for ${row.name}`,
          "SOLD_OUT",
        );
      }

      availableStock = Math.max(0, Number(variantRow.stock_quantity ?? 0));
      variantId = variantRow.id;
      variantType = variantRow.variant_type;
      variantLabel = variantRow.label;
      variantSku = variantRow.sku;
    } else if (!isProductPurchasable(product)) {
      throw new CheckoutValidationError(
        `Product sold out: ${row.name}`,
        "SOLD_OUT",
      );
    }

    if (line.quantity > availableStock) {
      throw new CheckoutValidationError(
        isRing
          ? `Insufficient stock for ${row.name} (size ${variantLabel})`
          : `Insufficient stock for ${row.name}`,
        "INSUFFICIENT_STOCK",
      );
    }

    const unitPrice = roundMoney(Number(row.price));
    const unitCost = roundMoney(Number(row.product_cost ?? 0));

    if (!isValidStripeUnitPrice(unitPrice)) {
      throw new CheckoutValidationError(
        `Invalid price for ${row.name} (minimum 0,01 EUR)`,
        "INVALID_PRICE",
      );
    }

    const imageUrl =
      row.product_images
        ?.slice()
        .sort((a, b) => a.position - b.position)[0]?.image_url ?? null;

    validated.push({
      productId: row.id,
      slug: row.slug,
      name: row.name,
      quantity: line.quantity,
      unitPrice,
      unitCost,
      currency: "EUR",
      imageUrl,
      variantId,
      variantType,
      variantLabel,
      variantSku,
    });

    subtotal = roundMoney(subtotal + unitPrice * line.quantity);
  }

  return {
    lines: validated,
    subtotal: roundMoney(subtotal),
    currency: "EUR",
  };
}
