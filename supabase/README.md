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
2. `footer.sql` — footer CMS tables (if upgrading an existing DB created before footer was merged into schema)  
3. `storage.sql` — buckets & storage policies  
4. `seed.sql` — optional demo rows (local `/public` paths)  
5. `footer-seed.sql` — footer defaults (if `seed.sql` was run before footer tables existed)  
6. `products-finance.sql` — product unit economics & inventory fields  
6b. `products-target-gender.sql` — shop navigation gender targeting (`women` / `men` / `unisex`)  
7. `collections-editorial.sql` — editorial collections CMS (media, blocks, layout)  
8. `publish-collections.sql` — one-time fix if `/collections` is empty but rows exist in Admin → Collections  
9. `finance.sql` — reporting periods, entries, orders (optional until finance module is used)
10. `stripe-checkout.sql` — Stripe session columns on `orders`, idempotent indexes, `decrement_product_stock()` RPC (run before enabling live Checkout)
11. `orders-fulfillment.sql` — fulfillment status, tracking, shipping address, shipping email guard (required for `/admin/orders`)
12. `shipping-country.sql` — `shipping_country` on orders (ISO code from Stripe)

Do **not** run `finance-seed.sql` — it contained demo data and is deprecated.

### Stripe webhook (production)

After deploy, register in [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks):

- URL: `https://dlucenti.com/api/stripe/webhook`
- Event: `checkout.session.completed`
- Signing secret → `STRIPE_WEBHOOK_SECRET` on Vercel

### Resend (order emails)

After `checkout.session.completed` with `payment_status: paid`, the webhook sends customer confirmation + admin notification when configured:

- `RESEND_API_KEY` — if missing, emails are skipped (checkout unaffected)
- `RESEND_FROM_EMAIL` — default `D'LUCENTI <hello@dlucenti.com>` (verify **dlucenti.com** in Resend for SPF/DKIM/DMARC)
- `RESEND_REPLY_TO_EMAIL` — optional; default `hello@dlucenti.com`
- `ADMIN_ORDER_EMAIL` — internal new-order inbox

Deliverability: use the verified domain only, keep `RESEND_FROM_EMAIL` on `@dlucenti.com`, and confirm DKIM + DMARC pass in Resend → Domains before production sends.

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
