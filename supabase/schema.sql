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

create type public.product_target_gender as enum (
  'women',
  'men',
  'unisex'
);

create type public.admin_role as enum (
  'owner',
  'editor',
  'viewer'
);

create type public.product_publication_status as enum ('draft', 'published');

create type public.collection_publication_status as enum ('draft', 'published');
create type public.collection_hero_alignment as enum ('left', 'center', 'right');
create type public.collection_text_color as enum ('light', 'dark');
create type public.collection_title_position as enum ('top', 'center', 'bottom');
create type public.collection_media_kind as enum (
  'hero_desktop',
  'hero_mobile',
  'editorial_cover',
  'thumbnail',
  'atmosphere',
  'editorial_gallery',
  'og_image'
);
create type public.collection_block_type as enum (
  'story',
  'quote',
  'cinematic_image',
  'gallery',
  'spacer'
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
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null,
  description text not null default '',
  cover_image text not null default '',
  featured boolean not null default false,
  short_title text not null default '',
  editorial_title text not null default '',
  subtitle text not null default '',
  launch_date date,
  publication_status public.collection_publication_status not null default 'draft',
  campaign_video_url text,
  story_body text not null default '',
  inspiration_text text not null default '',
  materials_text text not null default '',
  campaign_mood text not null default '',
  hero_alignment public.collection_hero_alignment not null default 'center',
  text_color public.collection_text_color not null default 'light',
  overlay_opacity numeric(3, 2) not null default 0.35,
  title_position public.collection_title_position not null default 'center',
  enable_fullscreen_hero boolean not null default true,
  enable_dark_mode_section boolean not null default false,
  meta_title text not null default '',
  meta_description text not null default '',
  og_image text not null default '',
  display_order integer not null default 0,
  hidden_from_frontend boolean not null default false,
  constraint collections_slug_unique unique (slug)
);

create trigger collections_set_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

create index collections_slug_idx on public.collections (slug);
create index collections_featured_idx on public.collections (featured) where featured = true;
create index collections_display_order_idx on public.collections (display_order);

create table public.collection_media (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  kind public.collection_media_kind not null,
  image_url text not null,
  alt text,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

create index collection_media_collection_idx on public.collection_media (collection_id, kind, position);

create table public.collection_blocks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  block_type public.collection_block_type not null,
  position integer not null check (position >= 0),
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index collection_blocks_collection_position_idx on public.collection_blocks (collection_id, position);

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
  target_gender public.product_target_gender not null default 'unisex',
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  new_in boolean not null default false,
  collection_id uuid references public.collections (id) on delete set null,
  active boolean not null default true,
  publication_status public.product_publication_status not null default 'draft',
  materials text not null default '',
  dimensions text not null default '',
  product_cost numeric(12, 2) not null default 0 check (product_cost >= 0),
  packaging_cost numeric(12, 2) not null default 0 check (packaging_cost >= 0),
  pouch_cost numeric(12, 2) not null default 0 check (pouch_cost >= 0),
  shipping_cost numeric(12, 2) not null default 0 check (shipping_cost >= 0),
  payment_fee_percent numeric(5, 2) not null default 2.9 check (payment_fee_percent >= 0),
  import_cost numeric(12, 2) not null default 0 check (import_cost >= 0),
  vat_rate numeric(5, 2) not null default 23 check (vat_rate >= 0 and vat_rate <= 100),
  supplier_name text not null default '',
  supplier_reference text not null default '',
  target_margin_percent numeric(5, 2),
  sku text,
  barcode text,
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  reserved_stock integer not null default 0 check (reserved_stock >= 0),
  lead_time_days integer not null default 0 check (lead_time_days >= 0),
  warehouse_location text not null default '',
  total_cost numeric(12, 2) not null default 0 check (total_cost >= 0),
  gross_margin_percent numeric(7, 2) not null default 0,
  estimated_net_profit numeric(12, 2) not null default 0,
  constraint products_slug_unique unique (slug)
);

create unique index products_sku_unique on public.products (sku) where sku is not null;

create index products_slug_idx on public.products (slug);
create index products_category_idx on public.products (category);
create index products_target_gender_idx on public.products (target_gender);
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
-- footer_settings + footer_social_links (storefront footer CMS)
-- ---------------------------------------------------------------------------

create table public.footer_settings (
  id uuid primary key default gen_random_uuid(),
  contact_email text not null default 'hello@dlucenti.com',
  slogan_en text not null,
  slogan_pt text not null,
  location_en text not null default 'Portugal',
  location_pt text not null default 'Portugal',
  explore_title_en text not null,
  explore_title_pt text not null,
  maison_title_en text not null,
  maison_title_pt text not null,
  contacts_title_en text not null,
  contacts_title_pt text not null,
  socials_title_en text not null,
  socials_title_pt text not null,
  updated_at timestamptz not null default now()
);

create trigger footer_settings_set_updated_at
before update on public.footer_settings
for each row execute function public.set_updated_at();

create table public.footer_social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  position integer not null check (position >= 0),
  active boolean not null default true,
  constraint footer_social_links_position_unique unique (position)
);

create index footer_social_links_active_position_idx
on public.footer_social_links (active, position)
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
alter table public.collection_media enable row level security;
alter table public.collection_blocks enable row level security;
alter table public.footer_settings enable row level security;
alter table public.footer_social_links enable row level security;
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

create policy "collection_media_public_read"
on public.collection_media for select
to anon, authenticated
using (true);

create policy "collection_blocks_public_read"
on public.collection_blocks for select
to anon, authenticated
using (true);

create policy "footer_settings_public_read"
on public.footer_settings for select
to anon, authenticated
using (true);

create policy "footer_social_links_public_read"
on public.footer_social_links for select
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

create policy "collection_media_admin_write"
on public.collection_media for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "collection_blocks_admin_write"
on public.collection_blocks for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "footer_settings_admin_write"
on public.footer_settings for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "footer_social_links_admin_write"
on public.footer_social_links for all
to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage buckets (run after schema; see supabase/storage.sql)
-- ---------------------------------------------------------------------------
