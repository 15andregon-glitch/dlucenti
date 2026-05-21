/**
 * Storefront product pipeline diagnostic (run: node scripts/diagnose-storefront-products.mjs)
 * Loads .env.local via dotenv if present; otherwise uses process.env.
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !service) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const PRODUCT_SELECT = `
  *,
  product_images (*),
  collections (*)
`;

const admin = createClient(url, service, { auth: { persistSession: false } });
const anonClient = createClient(url, anon, { auth: { persistSession: false } });

function isStorefrontProductVisible(row) {
  if (row.archived === true) return false;
  if (row.hidden_from_frontend === true) return false;
  const status = row.publication_status;
  if (status === "draft") return false;
  if (status === "published") return true;
  if (status == null || status === "") return row.active !== false;
  return false;
}

function tryMap(row) {
  const images = row.product_images ?? [];
  const sorted = [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    stock: Number(row.stock ?? 0),
    imageCount: sorted.length,
    firstImage: sorted[0]?.image_url ?? null,
    collectionSlug: row.collections?.slug ?? null,
  };
}

async function main() {
  console.log("=== 1. ADMIN: all products (flags) ===\n");
  const { data: all, error: allErr } = await admin
    .from("products")
    .select(
      "id, name, slug, publication_status, active, hidden_from_frontend, archived, stock, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (allErr) {
    console.error("Admin query error:", allErr);
    process.exit(1);
  }

  console.log(`Total sample rows: ${all.length}\n`);
  for (const row of all) {
    const visible = isStorefrontProductVisible(row);
    const passesOr =
      row.publication_status === "published" ||
      (row.publication_status == null && row.active === true);
    console.log({
      id: row.id,
      title: row.name,
      publication_status: row.publication_status,
      active: row.active,
      hidden_from_frontend: row.hidden_from_frontend,
      archived: row.archived,
      stock: row.stock,
      created_at: row.created_at,
      shouldRender_visibility: visible,
      passes_storefront_or_query: passesOr,
    });
  }

  const sample = all[0];
  if (!sample) {
    console.log("\nNo products in database.");
    process.exit(0);
  }

  console.log("\n=== 2. SAMPLE PRODUCT (first row) ===\n");
  console.log(sample);

  console.log("\n=== 3. ANON: storefront query (same as app) ===\n");
  const storefrontQ = anonClient
    .from("products")
    .select(PRODUCT_SELECT)
    .or(
      "publication_status.eq.published,and(publication_status.is.null,active.eq.true)",
    );

  const { data: anonRows, error: anonErr, count } = await storefrontQ
    .order("created_at", { ascending: false });

  if (anonErr) {
    console.error("Anon storefront query ERROR:", anonErr);
  } else {
    console.log(`Anon raw count: ${anonRows?.length ?? 0}`);
    const afterFilter = (anonRows ?? []).filter(isStorefrontProductVisible);
    console.log(`After visibility filter: ${afterFilter.length}`);
    const sampleAnon = anonRows?.find((r) => r.id === sample.id);
    console.log("Sample in anon result:", !!sampleAnon);
    if (sampleAnon) {
      try {
        console.log("Mapped sample:", tryMap(sampleAnon));
      } catch (e) {
        console.error("Mapper threw:", e);
      }
    }
  }

  console.log("\n=== 4. ANON: new_in + homepage_new_in ===\n");
  const { data: slots } = await anonClient
    .from("homepage_new_in")
    .select("position, product_id")
    .order("position", { ascending: true });

  console.log("homepage_new_in slots:", slots?.length ?? 0, slots);

  const { data: newIn } = await anonClient
    .from("products")
    .select(PRODUCT_SELECT)
    .or(
      "publication_status.eq.published,and(publication_status.is.null,active.eq.true)",
    )
    .eq("new_in", true);

  console.log("new_in flag products (anon):", newIn?.length ?? 0);

  if (slots?.length) {
    const ids = slots.map((s) => s.product_id);
    const { data: slotted, error: slotErr } = await anonClient
      .from("products")
      .select(PRODUCT_SELECT)
      .or(
        "publication_status.eq.published,and(publication_status.is.null,active.eq.true)",
      )
      .in("id", ids);
    console.log("Slotted products (anon):", slotted?.length ?? 0, slotErr ?? "");
  }

  console.log("\n=== 5. ADMIN: published only (no RLS) ===\n");
  const { data: published } = await admin
    .from("products")
    .select("id, name, publication_status, active, hidden_from_frontend, archived")
    .eq("publication_status", "published");
  console.log("Published count (admin):", published?.length ?? 0);

  console.log("\n=== 6. Test broken .or() vs simple query ===\n");
  const { data: simplePublished, error: spErr } = await anonClient
    .from("products")
    .select("id, name, publication_status, active")
    .eq("publication_status", "published");
  console.log("Anon .eq(published) only:", simplePublished?.length ?? 0, spErr ?? "");

  const { data: allAnon } = await anonClient.from("products").select("id").limit(5);
  console.log("Anon select id limit 5:", allAnon?.length ?? 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
