"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { revalidateStorefront } from "@/lib/i18n/revalidate";
import { actionError, slugify } from "@/lib/admin/utils";
import { parseProductForm, validateProductForm } from "@/lib/admin/parse-product-form";
import { uploadAdminFile, sanitizeFilename } from "@/lib/admin/upload";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { productImagePath } from "@/lib/supabase/storage";
import { supabaseAdmin } from "@/services/supabase/admin";
import { deleteProductImage } from "@/queries/mutations/products";
import { guardAdminAction } from "@/lib/admin/guard-action";

function revalidateAll() {
  revalidateStorefront("/", "/shop", "/shop/women", "/shop/men", "/shop/all");
  revalidatePath(ADMIN_ROUTES.products);
  revalidatePath(ADMIN_ROUTES.finance);
}

function productRowFromForm(formData: FormData) {
  const row = parseProductForm(formData);
  const validationError = validateProductForm(row);
  if (validationError) return { error: validationError as string, row: null };

  const isPublished = row.publication_status === "published";
  return {
    error: null,
    row: {
      ...row,
      active: isPublished ? row.active : false,
    },
  };
}

export async function createProductAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug =
      String(formData.get("slug") ?? "").trim() || slugify(name);
    if (!name) return actionError("Name is required");
    formData.set("slug", slug);

    const parsed = productRowFromForm(formData);
    if (parsed.error || !parsed.row) return actionError(parsed.error ?? "Invalid form");

    const { data, error } = await supabaseAdmin.adminProducts.create(parsed.row);

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const, id: data!.id };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to create product");
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const parsed = productRowFromForm(formData);
    if (parsed.error || !parsed.row) return actionError(parsed.error ?? "Invalid form");

    const { error } = await supabaseAdmin.adminProducts.update(id, parsed.row);

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.product(id));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update product");
  }
}

export async function deleteProductAction(id: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;
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
  const denied = await guardAdminAction();
  if (denied) return denied;
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
  const denied = await guardAdminAction();
  if (denied) return denied;
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
  const denied = await guardAdminAction();
  if (denied) return denied;
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
