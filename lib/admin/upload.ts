import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getStoragePublicUrl,
  type StorageBucket,
} from "@/lib/supabase/storage";
import { uploadStorageObject } from "@/queries/mutations/storage";

export async function uploadAdminFile(
  bucket: StorageBucket,
  path: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const client = createSupabaseAdminClient();
  const { error } = await uploadStorageObject(client, bucket, path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const url = getStoragePublicUrl(bucket, path);
  return { url, path };
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}
