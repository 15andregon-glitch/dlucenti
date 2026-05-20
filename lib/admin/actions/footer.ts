"use server";

import { revalidatePath } from "next/cache";
import { revalidateSiteChrome } from "@/lib/i18n/revalidate";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { actionError, parseCheckbox } from "@/lib/admin/utils";
import { supabaseAdmin } from "@/services/supabase/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guardAdminAction } from "@/lib/admin/guard-action";

function revalidateAll() {
  revalidateSiteChrome();
  revalidatePath(ADMIN_ROUTES.footer);
}

function readFooterSettingsForm(formData: FormData) {
  const trim = (key: string) => String(formData.get(key) ?? "").trim();

  return {
    contact_email: trim("contact_email"),
    slogan_en: trim("slogan_en"),
    slogan_pt: trim("slogan_pt"),
    location_en: trim("location_en"),
    location_pt: trim("location_pt"),
    explore_title_en: trim("explore_title_en"),
    explore_title_pt: trim("explore_title_pt"),
    maison_title_en: trim("maison_title_en"),
    maison_title_pt: trim("maison_title_pt"),
    contacts_title_en: trim("contacts_title_en"),
    contacts_title_pt: trim("contacts_title_pt"),
    socials_title_en: trim("socials_title_en"),
    socials_title_pt: trim("socials_title_pt"),
  };
}

export async function updateFooterSettingsAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const row = readFooterSettingsForm(formData);
    if (!row.contact_email) return actionError("Contact email is required");
    if (!row.slogan_en || !row.slogan_pt) return actionError("Slogan is required in both languages");

    const { error } = await supabaseAdmin.adminFooter.updateSettings(row);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update footer");
  }
}

export async function createFooterSocialLinkAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const label = String(formData.get("label") ?? "").trim();
    const url = String(formData.get("url") ?? "").trim();
    if (!label || !url) return actionError("Label and URL are required");

    const client = createSupabaseAdminClient();
    const { count } = await client
      .from("footer_social_links")
      .select("id", { count: "exact", head: true });
    const position = count ?? 0;

    const { error } = await supabaseAdmin.adminFooter.createSocialLink({
      label,
      url,
      position,
      active: parseCheckbox(formData.get("active")) || true,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to add social link");
  }
}

export async function updateFooterSocialLinkAction(id: string, formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const label = String(formData.get("label") ?? "").trim();
    const url = String(formData.get("url") ?? "").trim();
    const active = parseCheckbox(formData.get("active"));

    const { error } = await supabaseAdmin.adminFooter.updateSocialLink(id, {
      ...(label ? { label } : {}),
      ...(url ? { url } : {}),
      active,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update social link");
  }
}

export async function deleteFooterSocialLinkAction(id: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminFooter.removeSocialLink(id);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to delete social link");
  }
}

export async function reorderFooterSocialLinksAction(
  ordered: { id: string; position: number }[],
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminFooter.reorderSocialLinks(ordered);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to reorder social links");
  }
}

export async function toggleFooterSocialLinkActiveAction(id: string, active: boolean) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminFooter.updateSocialLink(id, { active });
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update social link");
  }
}
