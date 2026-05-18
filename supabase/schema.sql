-- =============================================================================
-- Maison Aurélie — Supabase schema
-- Paste into Supabase SQL Editor (or run via Supabase CLI migrations)
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.product_category as enum (
  'rings',
  'necklaces',
  'earrings',
  'bracelets',
  'objects'
);

create type public.admin_role as enum (
  'owner',
  'editor',
  'viewer'
);

-- ---------------------------------------------------------------------------
-- Utilities
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------------

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null,
  description text not null default '',
  cover_image text not null default '',
  featured boolean not null default false,
  constraint collections_slug_unique unique (slug)
);

create index collections_slug_idx on public.collections (slug);
create index collections_featured_idx on public.collections (featured) where featured = true;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------

create table public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  category public.product_category not null,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  new_in boolean not null default false,
  collection_id uuid references public.collections (id) on delete set null,
  active boolean not null default true,
  constraint products_slug_unique unique (slug)
);

create index products_slug_idx on public.products (slug);
create index products_category_idx on public.products (category);
create index products_collection_id_idx on public.products (collection_id);
create index products_active_idx on public.products (active) where active = true;
create index products_featured_idx on public.products (featured) where featured = true;
create index products_new_in_idx on public.products (new_in) where new_in = true;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  alt text,
  position integer not null default 0 check (position >= 0),
  constraint product_images_product_position_unique unique (product_id, position)
);

create index product_images_product_id_idx on public.product_images (product_id);
create index product_images_product_position_idx on public.product_images (product_id, position);

-- ---------------------------------------------------------------------------
-- homepage_settings (singleton row recommended)
-- ---------------------------------------------------------------------------

create table public.homepage_settings (
  id uuid primary key default gen_random_uuid(),
  hero_video_url text,
  featured_collection_id uuid references public.collections (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger homepage_settings_set_updated_at
before update on public.homepage_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- homepage_new_in
-- ---------------------------------------------------------------------------

create table public.homepage_new_in (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  position integer not null check (position >= 0),
  constraint homepage_new_in_position_unique unique (position),
  constraint homepage_new_in_product_unique unique (product_id)
);

create index homepage_new_in_position_idx on public.homepage_new_in (position);

-- ---------------------------------------------------------------------------
-- campaigns (homepage editorial gallery)
-- ---------------------------------------------------------------------------

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  position integer not null check (position >= 0),
  active boolean not null default true,
  constraint campaigns_position_unique unique (position)
);

create index campaigns_active_position_idx on public.campaigns (active, position)
where active = true;

-- ---------------------------------------------------------------------------
-- admins (dashboard / CMS operators)
-- ---------------------------------------------------------------------------

create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role public.admin_role not null default 'editor',
  created_at timestamptz not null default now(),
  constraint admins_email_unique unique (email)
);

create index admins_role_idx on public.admins (role);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.homepage_settings enable row level security;
alter table public.homepage_new_in enable row level security;
alter table public.campaigns enable row level security;
alter table public.admins enable row level security;

-- Public read: published storefront content
create policy "collections_public_read"
on public.collections for select
to anon, authenticated
using (true);

create policy "products_public_read"
on public.products for select
to anon, authenticated
using (active = true);

create policy "product_images_public_read"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.active = true
  )
);

create policy "homepage_settings_public_read"
on public.homepage_settings for select
to anon, authenticated
using (true);

create policy "homepage_new_in_public_read"
on public.homepage_new_in for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.active = true
  )
);

create policy "campaigns_public_read"
on public.campaigns for select
to anon, authenticated
using (active = true);

-- Admins: self-read; service role bypasses RLS for dashboard mutations
create policy "admins_self_read"
on public.admins for select
to authenticated
using (auth.uid() = id);

-- Authenticated admins can manage content (extend with role checks in app layer)
create policy "products_admin_write"
on public.products for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "product_images_admin_write"
on public.product_images for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "collections_admin_write"
on public.collections for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "homepage_settings_admin_write"
on public.homepage_settings for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "homepage_new_in_admin_write"
on public.homepage_new_in for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "campaigns_admin_write"
on public.campaigns for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage buckets (run after schema; see supabase/storage.sql)
-- ---------------------------------------------------------------------------
