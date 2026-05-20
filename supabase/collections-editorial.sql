-- Editorial collections CMS (run after schema.sql)

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

alter table public.collections
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists short_title text not null default '',
  add column if not exists editorial_title text not null default '',
  add column if not exists subtitle text not null default '',
  add column if not exists launch_date date,
  add column if not exists publication_status public.collection_publication_status not null default 'draft',
  add column if not exists campaign_video_url text,
  add column if not exists story_body text not null default '',
  add column if not exists inspiration_text text not null default '',
  add column if not exists materials_text text not null default '',
  add column if not exists campaign_mood text not null default '',
  add column if not exists hero_alignment public.collection_hero_alignment not null default 'center',
  add column if not exists text_color public.collection_text_color not null default 'light',
  add column if not exists overlay_opacity numeric(3, 2) not null default 0.35 check (overlay_opacity >= 0 and overlay_opacity <= 1),
  add column if not exists title_position public.collection_title_position not null default 'center',
  add column if not exists enable_fullscreen_hero boolean not null default true,
  add column if not exists enable_dark_mode_section boolean not null default false,
  add column if not exists meta_title text not null default '',
  add column if not exists meta_description text not null default '',
  add column if not exists og_image text not null default '',
  add column if not exists display_order integer not null default 0,
  add column if not exists hidden_from_frontend boolean not null default false;

create trigger collections_set_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

create table if not exists public.collection_media (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  kind public.collection_media_kind not null,
  image_url text not null,
  alt text,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

create index if not exists collection_media_collection_idx
on public.collection_media (collection_id, kind, position);

create table if not exists public.collection_blocks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  block_type public.collection_block_type not null,
  position integer not null check (position >= 0),
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists collection_blocks_collection_position_idx
on public.collection_blocks (collection_id, position);

alter table public.collection_media enable row level security;
alter table public.collection_blocks enable row level security;

create policy "collection_media_public_read"
on public.collection_media for select to anon, authenticated using (true);

create policy "collection_blocks_public_read"
on public.collection_blocks for select to anon, authenticated using (true);

create policy "collection_media_admin_write"
on public.collection_media for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "collection_blocks_admin_write"
on public.collection_blocks for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- Publish existing seed/demo collections (draft by default after migration)
update public.collections
set
  publication_status = 'published',
  hidden_from_frontend = false,
  editorial_title = coalesce(nullif(trim(editorial_title), ''), name),
  short_title = coalesce(nullif(trim(short_title), ''), name)
where publication_status = 'draft'
  and coalesce(trim(cover_image), '') <> '';
