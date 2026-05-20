"use server";

import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/i18n/revalidate";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { actionError, parseOptionalUuid } from "@/lib/admin/utils";
import { uploadAdminFile, sanitizeFilename } from "@/lib/admin/upload";
import { heroVideoPath } from "@/lib/supabase/storage";
import { supabaseAdmin } from "@/services/supabase/admin";
import { guardAdminAction } from "@/lib/admin/guard-action";

function revalidateAll() {
  revalidateStorefront("/");
  revalidatePath(ADMIN_ROUTES.homepage);
}

export async function updateHomepageSettingsAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const featured_collection_id = parseOptionalUuid(
      formData.get("featured_collection_id"),
    );
    const hero_video_url =
      String(formData.get("hero_video_url") ?? "").trim() || null;

    const { error } = await supabaseAdmin.adminHomepage.updateSettings({
      hero_video_url,
      featured_collection_id,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update homepage");
  }
}

export async function uploadHeroVideoAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return actionError("No file provided");
    }

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = heroVideoPath(filename);
    const { url } = await uploadAdminFile("videos", path, file);

    const { error } = await supabaseAdmin.adminHomepage.updateSettings({
      hero_video_url: url,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const, url };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Upload failed");
  }
}

export async function setHomepageNewInAction(productIds: string[]) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const items = productIds.map((product_id, position) => ({
      product_id,
      position,
    }));
    const { error } = await supabaseAdmin.adminHomepage.setNewIn(items);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update New In");
  }
}
