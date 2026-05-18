# Supabase backend — Maison Aurélie

## Installation

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Copy environment template:

```bash
cp env.local.example .env.local
```

Fill in keys from [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → API.

## SQL setup (order)

1. `schema.sql` — tables, indexes, RLS, triggers  
2. `storage.sql` — buckets & storage policies  
3. `seed.sql` — optional demo rows (local `/public` paths)

## Enable live data

Set in `.env.local`:

```
NEXT_PUBLIC_USE_SUPABASE=true
```

Then point `services/products.ts` (and siblings) at `services/supabase/*` via `services/data-source.ts`.

## Storage buckets

| Bucket        | Use                          |
|---------------|------------------------------|
| `products`    | Product gallery images       |
| `campaigns`   | Homepage campaign gallery    |
| `videos`      | Hero background video        |
| `collections` | Collection cover art         |

Public URLs: `lib/supabase/storage.ts` → `getStoragePublicUrl()`.

## Project layout

```
supabase/
  schema.sql
  storage.sql
  seed.sql
lib/supabase/
  client.ts          # browser
  server.ts          # RSC / routes
  admin.ts           # service role
  env.ts
  mappers.ts
  storage.ts
types/database/
  schema.ts
  tables.ts
queries/
  products.ts
  collections.ts
  homepage.ts
  campaigns.ts
  mutations/
services/supabase/
  products.ts
  collections.ts
  homepage.ts
  admin.ts
```

## Future: orders

Add `orders` and `order_items` tables referencing `products` when checkout goes live. Admin RLS patterns in `schema.sql` can be extended the same way.
