export { createSupabaseBrowserClient } from "./client";
export { createSupabaseServerClient } from "./server";
export { createSupabaseAdminClient } from "./admin";
export {
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  isSupabaseEnabled,
  hasSupabaseEnv,
} from "./env";
export {
  STORAGE_BUCKETS,
  getStoragePublicUrl,
  productImagePath,
  campaignImagePath,
  collectionCoverPath,
  heroVideoPath,
  type StorageBucket,
} from "./storage";
