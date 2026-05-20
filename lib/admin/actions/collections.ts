"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { revalidateStorefront } from "@/lib/i18n/revalidate";
import { actionError, slugify } from "@/lib/admin/utils";
import {
  parseCollectionForm,
  validateCollectionForm,
} from "@/lib/admin/parse-collection-form";
import { uploadAdminFile, sanitizeFilename } from "@/lib/admin/upload";
import {
  collectionCampaignVideoPath,
  collectionCoverPath,
} from "@/lib/supabase/storage";
import { supabaseAdmin } from "@/services/supabase/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guardAdminAction } from "@/lib/admin/guard-action";
import type { Json } from "@/types/database";
import type { CollectionBlockType, CollectionMediaKind } from "@/types/database/schema";

function revalidateAll() {
  revalidateStorefront("/", "/collections");
  revalidatePath(ADMIN_ROUTES.collections);
}

export async function createCollectionAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug =
      String(formData.get("slug") ?? "").trim() || slugify(name);
    formData.set("slug", slug);
    if (!name) return actionError("Name is required");

    const row = parseCollectionForm(formData);
    const err = validateCollectionForm(row);
    if (err) return actionError(err);

    const client = createSupabaseAdminClient();
    const { count } = await client
      .from("collections")
      .select("id", { count: "exact", head: true });

    const { data, error } = await supabaseAdmin.adminCollections.create({
      ...row,
      editorial_title: row.editorial_title || row.name,
      display_order: count ?? 0,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const, id: data!.id };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to create collection");
  }
}

export async function updateCollectionAction(id: string, formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const row = parseCollectionForm(formData);
    const err = validateCollectionForm(row);
    if (err) return actionError(err);

    const { error } = await supabaseAdmin.adminCollections.update(id, {
      ...row,
      editorial_title: row.editorial_title || row.name,
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
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCollections.remove(id);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to delete collection");
  }
}

export async function reorderCollectionsAction(
  ordered: { id: string; display_order: number }[],
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCollections.reorder(ordered);
    if (error) return actionError(error.message);
    revalidateAll();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to reorder collections");
  }
}

export async function uploadCollectionCampaignVideoAction(
  collectionId: string,
  formData: FormData,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return actionError("No file provided");
    }

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = collectionCampaignVideoPath(collectionId, filename);
    const { url } = await uploadAdminFile("videos", path, file);

    const { error } = await supabaseAdmin.adminCollections.update(collectionId, {
      campaign_video_url: url,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const, url };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Upload failed");
  }
}

export async function uploadCollectionCoverAction(
  collectionId: string,
  formData: FormData,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
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

export async function uploadCollectionMediaAction(
  collectionId: string,
  kind: CollectionMediaKind,
  formData: FormData,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return actionError("No file provided");
    }

    const client = createSupabaseAdminClient();
    const { count } = await client
      .from("collection_media")
      .select("id", { count: "exact", head: true })
      .eq("collection_id", collectionId)
      .eq("kind", kind);

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = collectionCoverPath(collectionId, `${kind}-${filename}`);
    const { url } = await uploadAdminFile("collections", path, file);

    const { error } = await supabaseAdmin.adminCollections.addMedia({
      collection_id: collectionId,
      kind,
      image_url: url,
      alt: String(formData.get("alt") ?? "").trim() || null,
      position: count ?? 0,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const, url };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Upload failed");
  }
}

export async function deleteCollectionMediaAction(mediaId: string, collectionId: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCollections.removeMedia(mediaId);
    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Delete failed");
  }
}

export async function reorderCollectionMediaAction(
  collectionId: string,
  ordered: { id: string; position: number }[],
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCollections.reorderMedia(ordered);
    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Reorder failed");
  }
}

export async function createCollectionBlockAction(
  collectionId: string,
  blockType: CollectionBlockType,
  content: Record<string, unknown>,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const client = createSupabaseAdminClient();
    const { count } = await client
      .from("collection_blocks")
      .select("id", { count: "exact", head: true })
      .eq("collection_id", collectionId);

    const { error } = await supabaseAdmin.adminCollections.addBlock({
      collection_id: collectionId,
      block_type: blockType,
      position: count ?? 0,
      content: content as Json,
    });

    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to add block");
  }
}

export async function deleteCollectionBlockAction(
  blockId: string,
  collectionId: string,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;
  try {
    const { error } = await supabaseAdmin.adminCollections.removeBlock(blockId);
    if (error) return actionError(error.message);
    revalidateAll();
    revalidatePath(ADMIN_ROUTES.collection(collectionId));
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to delete block");
  }
}
