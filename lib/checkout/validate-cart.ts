import "server-only";

import { isProductPurchasable } from "@/lib/product-availability";
import { isStorefrontProductVisible } from "@/lib/product-editorial-visibility";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
      | "CONFIG",
  ) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

function normalizeLines(
  items: CheckoutCartLineInput[],
): CheckoutCartLineInput[] {
  const merged = new Map<string, number>();

  for (const item of items) {
    const productId = item.productId?.trim();
    const quantity = Math.floor(Number(item.quantity));
    if (!productId || quantity <= 0) continue;
    merged.set(productId, (merged.get(productId) ?? 0) + quantity);
  }

  return [...merged.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
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

  const ids = lines.map((l) => l.productId);
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

    const product = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      currency: "EUR",
      category: row.category,
      targetGender: row.target_gender ?? "unisex",
      images: (row.product_images ?? [])
        .sort((a, b) => a.position - b.position)
        .map((img) => img.image_url),
      stock: Number(row.stock ?? 0),
    };

    if (!isProductPurchasable(product)) {
      throw new CheckoutValidationError(
        `Product sold out: ${row.name}`,
        "SOLD_OUT",
      );
    }

    const stock = Math.max(0, Number(row.stock ?? 0));
    if (line.quantity > stock) {
      throw new CheckoutValidationError(
        `Insufficient stock for ${row.name}`,
        "INSUFFICIENT_STOCK",
      );
    }

    const unitPrice = Number(row.price);
    const unitCost = Number(row.product_cost ?? 0);
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
    });

    subtotal += unitPrice * line.quantity;
  }

  return {
    lines: validated,
    subtotal,
    currency: "EUR",
  };
}
