-- =============================================================================
-- Supabase Storage — buckets & policies
-- Run in SQL Editor after creating buckets in Dashboard (or via API)
-- Bucket names: products, campaigns, videos, collections
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'products',
    'products',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'campaigns',
    'campaigns',
    true,
    15728640,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'videos',
    'videos',
    true,
    104857600,
    array['video/mp4', 'video/webm']
  ),
  (
    'collections',
    'collections',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do nothing;

-- Public read for storefront assets
create policy "storage_public_read_products"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'products');

create policy "storage_public_read_campaigns"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'campaigns');

create policy "storage_public_read_videos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'videos');

create policy "storage_public_read_collections"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'collections');

-- Admin upload (authenticated + admins table)
create policy "storage_admin_insert_products"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'products'
  and exists (select 1 from public.admins a where a.id = auth.uid())
);

create policy "storage_admin_insert_campaigns"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'campaigns'
  and exists (select 1 from public.admins a where a.id = auth.uid())
);

create policy "storage_admin_insert_videos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'videos'
  and exists (select 1 from public.admins a where a.id = auth.uid())
);

create policy "storage_admin_insert_collections"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'collections'
  and exists (select 1 from public.admins a where a.id = auth.uid())
);

create policy "storage_admin_update"
on storage.objects for update
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "storage_admin_delete"
on storage.objects for delete
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()));
