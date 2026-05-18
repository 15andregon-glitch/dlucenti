import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { StorageBucket } from "@/lib/supabase/storage";

type Client = SupabaseClient<Database>;

export async function uploadStorageObject(
  client: Client,
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string },
) {
  return client.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? true,
    contentType: options?.contentType,
  });
}

export async function removeStorageObject(
  client: Client,
  bucket: StorageBucket,
  paths: string[],
) {
  return client.storage.from(bucket).remove(paths);
}

export function getPublicUrl(client: Client, bucket: StorageBucket, path: string) {
  return client.storage.from(bucket).getPublicUrl(path);
}
