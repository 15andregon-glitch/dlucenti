"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  actionError,
  parseCheckbox,
  parseNumber,
  parseOptionalUuid,
  slugify,
} from "@/lib/admin/utils";
import { uploadAdminFile, sanitizeFilename } from "@/lib/admin/upload";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { productImagePath } from "@/lib/supabase/storage";
import { supabaseAdmin } from "@/services/supabase/admin";
import { deleteProductImage } from "@/queries/mutations/products";
import type { ProductCategory } from "@/types/database/schema";

const REVALIDATE = ["/", "/shop", ADMIN_ROUTES.products];

function revalidateAll() {
  REVALIDATE.forEach((p) => revalidatePath(p));
}

export async function createProductAction(formData: FormData) {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug =
      String(formData.get("slug") ?? "").trim() || slugify(name);
    if (!name) return actionError("Name is required");

    const { data, error } = await supabaseAdmin.adminProducts.create({
      name,
      slug,
      description: String(formData.get("description") ?? ""),
      price: parseNumber(formData.get("price")),
      category: String(formData.get("category") ?? "rings") as ProductCategory,
      stock: parseNumber(formData.get("stock")),
      featured: parseCheckbox(formData.get("featured")),
      new_in: parseCheckbox(formData.get("new_in")),
      active: parseCheckbox(formData.get("active")) || true,
      collection_id: parseOptionalUuid(formData.get("collection_id")),
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const, id: data!.id };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to create product");
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    if (!name || !slug) return actionError("Name and slug are required");

    const { error } = await supabaseAdmin.adminProducts.update(id, {
      name,
      slug,
      description: String(formData.get("description") ?? ""),
      price: parseNumber(formData.get("price")),
      category: String(formData.get("category") ?? "rings") as ProductCategory,
      stock: parseNumber(formData.get("stock")),
      featured: parseCheckbox(formData.get("featured")),
      new_in: parseCheckbox(formData.get("new_in")),
      active: parseCheckbox(formData.get("active")),
      collection_id: parseOptionalUuid(formData.get("collection_id")),
    });

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.product(id));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update product");
  }
}

export async function deleteProductAction(id: string) {
  try {
    const { error } = await supabaseAdmin.adminProducts.remove(id);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to delete product");
  }
}

export async function uploadProductImageAction(productId: string, formData: FormData) {
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return actionError("No file provided");
    }

    const client = createSupabaseAdminClient();
    const { count } = await client
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);
    const position = count ?? 0;

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = productImagePath(productId, filename);
    const { url } = await uploadAdminFile("products", path, file);

    const alt = String(formData.get("alt") ?? "").trim() || null;

    const { error } = await supabaseAdmin.adminProducts.upsertImages([
      { product_id: productId, image_url: url, alt, position },
    ]);

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.product(productId));
    return { ok: true as const, url };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Upload failed");
  }
}

export async function reorderProductImagesAction(
  productId: string,
  ordered: { id: string; position: number }[],
) {
  try {
    const client = createSupabaseAdminClient();
    for (const { id, position } of ordered) {
      const { error } = await client
        .from("product_images")
        .update({ position })
        .eq("id", id)
        .eq("product_id", productId);
      if (error) return actionError(error.message);
    }
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.product(productId));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Reorder failed");
  }
}

export async function deleteProductImageAction(productId: string, imageId: string) {
  try {
    const { error } = await deleteProductImage(
      createSupabaseAdminClient(),
      imageId,
    );
    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.product(productId));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Delete failed");
  }
}
