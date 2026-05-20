-- Footer CMS (run after schema.sql)
-- Singleton settings + ordered social links

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

alter table public.footer_settings enable row level security;
alter table public.footer_social_links enable row level security;

create policy "footer_settings_public_read"
on public.footer_settings for select
to anon, authenticated
using (true);

create policy "footer_social_links_public_read"
on public.footer_social_links for select
to anon, authenticated
using (active = true);

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
