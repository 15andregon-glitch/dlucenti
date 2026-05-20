"use server";

import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/i18n/revalidate";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { actionError, parseCheckbox } from "@/lib/admin/utils";
import { uploadAdminFile, sanitizeFilename } from "@/lib/admin/upload";
import { campaignImagePath } from "@/lib/supabase/storage";
import { supabaseAdmin } from "@/services/supabase/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guardAdminAction } from "@/lib/admin/guard-action";

function revalidateAll() {
  revalidateStorefront("/");
  revalidatePath(ADMIN_ROUTES.campaigns);
}

export async function createCampaignAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const client = createSupabaseAdminClient();
    const { count } = await client
      .from("campaigns")
      .select("id", { count: "exact", head: true });
    const position = count ?? 0;

    let image_url = String(formData.get("image_url") ?? "").trim();
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
      const path = campaignImagePath(filename);
      const uploaded = await uploadAdminFile("campaigns", path, file);
      image_url = uploaded.url;
    }

    if (!image_url) return actionError("Image is required");

    const { error } = await supabaseAdmin.adminCampaigns.create({
      image_url,
      position,
      active: parseCheckbox(formData.get("active")) || true,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to create campaign");
  }
}

export async function updateCampaignAction(id: string, formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const active = parseCheckbox(formData.get("active"));
    const image_url = String(formData.get("image_url") ?? "").trim();

    const { error } = await supabaseAdmin.adminCampaigns.update(id, {
      active,
      ...(image_url ? { image_url } : {}),
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update campaign");
  }
}

export async function deleteCampaignAction(id: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCampaigns.remove(id);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to delete campaign");
  }
}

export async function reorderCampaignsAction(
  ordered: { id: string; position: number }[],
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCampaigns.reorder(ordered);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Reorder failed");
  }
}

export async function uploadCampaignImageAction(id: string, formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return actionError("No file provided");
    }

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = campaignImagePath(filename);
    const { url } = await uploadAdminFile("campaigns", path, file);

    const { error } = await supabaseAdmin.adminCampaigns.update(id, {
      image_url: url,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const, url };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Upload failed");
  }
}

export async function toggleCampaignActiveAction(id: string, active: boolean) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCampaigns.update(id, { active });
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Update failed");
  }
}
