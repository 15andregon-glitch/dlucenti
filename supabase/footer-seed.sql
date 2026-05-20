-- Footer defaults (run after footer.sql)

insert into public.footer_settings (
  contact_email,
  slogan_en,
  slogan_pt,
  location_en,
  location_pt,
  explore_title_en,
  explore_title_pt,
  maison_title_en,
  maison_title_pt,
  contacts_title_en,
  contacts_title_pt,
  socials_title_en,
  socials_title_pt
)
values (
  'hello@dlucenti.com',
  'Contemporary minimalism shaped by tradition.',
  'Minimalismo contemporâneo moldado pela tradição.',
  'Portugal',
  'Portugal',
  'Explore',
  'Explorar',
  'House',
  'A Casa',
  'Contacts',
  'Contactos',
  'Socials',
  'Redes Sociais'
);

insert into public.footer_social_links (label, url, position, active)
values
  ('Instagram', 'https://instagram.com/', 0, true),
  ('Pinterest', 'https://pinterest.com/', 1, true),
  ('TikTok', 'https://tiktok.com/', 2, true)
on conflict (position) do nothing;
