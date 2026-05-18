import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function fetchAdminById(client: Client, id: string) {
  return client.from("admins").select("*").eq("id", id).maybeSingle();
}

export async function fetchAdminByEmail(client: Client, email: string) {
  return client.from("admins").select("*").eq("email", email).maybeSingle();
}

export async function insertAdmin(
  client: Client,
  row: TablesInsert<"admins">,
) {
  return client.from("admins").insert(row).select().single();
}
