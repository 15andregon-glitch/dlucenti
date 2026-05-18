"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { actionError, parseCheckbox, slugify } from "@/lib/admin/utils";
import { uploadAdminFile, sanitizeFilename } from "@/lib/admin/upload";
import { collectionCoverPath } from "@/lib/supabase/storage";
import { supabaseAdmin } from "@/services/supabase/admin";

function revalidateAll() {
  ["/", "/collections", ADMIN_ROUTES.collections].forEach((p) =>
    revalidatePath(p),
  );
}

export async function createCollectionAction(formData: FormData) {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug =
      String(formData.get("slug") ?? "").trim() || slugify(name);
    if (!name) return actionError("Name is required");

    const { data, error } = await supabaseAdmin.adminCollections.create({
      name,
      slug,
      description: String(formData.get("description") ?? ""),
      cover_image: String(formData.get("cover_image") ?? ""),
      featured: parseCheckbox(formData.get("featured")),
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const, id: data!.id };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to create collection");
  }
}

export async function updateCollectionAction(id: string, formData: FormData) {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    if (!name || !slug) return actionError("Name and slug are required");

    const { error } = await supabaseAdmin.adminCollections.update(id, {
      name,
      slug,
      description: String(formData.get("description") ?? ""),
      cover_image: String(formData.get("cover_image") ?? ""),
      featured: parseCheckbox(formData.get("featured")),
    });

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(id));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update collection");
  }
}

export async function deleteCollectionAction(id: string) {
  try {
    const { error } = await supabaseAdmin.adminCollections.remove(id);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to delete collection");
  }
}

export async function uploadCollectionCoverAction(
  collectionId: string,
  formData: FormData,
) {
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return actionError("No file provided");
    }

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = collectionCoverPath(collectionId, filename);
    const { url } = await uploadAdminFile("collections", path, file);

    const { error } = await supabaseAdmin.adminCollections.update(collectionId, {
      cover_image: url,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const, url };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Upload failed");
  }
}
