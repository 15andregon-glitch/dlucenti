-- Storefront RLS: CMS publication only (not inventory, not legacy active alone).
-- Run in Supabase SQL Editor. Safe if columns hidden_from_frontend / archived are missing.

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products for select
to anon, authenticated
using (
  publication_status = 'published'
  or (publication_status is null and active is true)
);

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and (
        p.publication_status = 'published'
        or (p.publication_status is null and p.active is true)
      )
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
      and (
        p.publication_status = 'published'
        or (p.publication_status is null and p.active is true)
      )
  )
);

-- Undo mistaken hide backfill (products-storefront-visibility.sql set hidden_from_frontend from active=false).
update public.products
set hidden_from_frontend = false,
    active = true
where publication_status = 'published'
  and hidden_from_frontend = true;

-- Ensure published catalog is visible (stock = 0 included).
update public.products
set active = true
where publication_status = 'published'
  and active = false;
