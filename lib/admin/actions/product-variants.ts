"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  replaceRingSizesForProduct,
  type RingSizeInput,
} from "@/queries/product-variants";

export type SaveRingSizesResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveRingSizesAction(
  productId: string,
  sizes: RingSizeInput[],
): Promise<SaveRingSizesResult> {
  if (!productId) {
    return { ok: false, error: "Missing product id" };
  }

  const labels = sizes.map((s) => s.label.trim()).filter(Boolean);
  if (labels.length !== new Set(labels).size) {
    return { ok: false, error: "Duplicate ring sizes are not allowed" };
  }

  for (const size of sizes) {
    if (!size.label.trim()) {
      return { ok: false, error: "Each size needs a label" };
    }
  }

  try {
    const client = createSupabaseAdminClient();
    const { data: product, error: productError } = await client
      .from("products")
      .select("category")
      .eq("id", productId)
      .maybeSingle();

    if (productError || !product) {
      return { ok: false, error: "Product not found" };
    }

    if (product.category !== "rings") {
      return { ok: false, error: "Ring sizes apply only to ring products" };
    }

    await replaceRingSizesForProduct(client, productId, sizes);

    revalidatePath(ADMIN_ROUTES.product(productId));
    revalidatePath(ADMIN_ROUTES.products);

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save ring sizes";
    return { ok: false, error: message };
  }
}
