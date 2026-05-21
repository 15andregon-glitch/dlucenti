-- Storefront visibility: CMS state only (not inventory).
-- Run in Supabase SQL editor after schema.sql, then products-rls-hotfix.sql if RLS was already tightened.

alter table public.products
  add column if not exists hidden_from_frontend boolean not null default false,
  add column if not exists archived boolean not null default false;

-- Do NOT map active=false → hidden_from_frontend (breaks sold-out / legacy rows).

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products for select
to anon, authenticated
using (
  publication_status = 'published'
  and coalesce(hidden_from_frontend, false) = false
  and coalesce(archived, false) = false
);

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and p.publication_status = 'published'
      and coalesce(p.hidden_from_frontend, false) = false
      and coalesce(p.archived, false) = false
  )
);

drop policy if exists "homepage_new_in_public_read" on public.homepage_new_in;
create policy "homepage_new_in_public_read"
on public.homepage_new_in for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and p.publication_status = 'published'
      and coalesce(p.hidden_from_frontend, false) = false
      and coalesce(p.archived, false) = false
  )
);
