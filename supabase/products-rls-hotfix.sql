-- URGENT hotfix: restore storefront without new product columns.
-- Run this in Supabase SQL Editor if the site shows "This page couldn't load".
-- Safe to run before products-storefront-visibility.sql.

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products for select
to anon, authenticated
using (publication_status = 'published');

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and p.publication_status = 'published'
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
  )
);
