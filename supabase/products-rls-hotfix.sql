-- Storefront RLS: CMS visibility only (not inventory).
-- Run in Supabase SQL Editor. Aligns with app queries in queries/products.ts.

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products for select
to anon, authenticated
using (publication_status = 'published' and active = true);

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and p.publication_status = 'published'
      and p.active = true
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
      and p.active = true
  )
);

-- Restore visibility for published products (stock = 0 must stay visible).
update public.products
set active = true
where publication_status = 'published'
  and active = false;
