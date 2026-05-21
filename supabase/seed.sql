-- =============================================================================
-- Optional seed — maps existing local /public assets to CMS rows
-- Adjust URLs after uploading assets to Supabase Storage
-- =============================================================================

insert into public.collections (
  id,
  name,
  slug,
  description,
  cover_image,
  featured,
  publication_status,
  editorial_title,
  short_title,
  hidden_from_frontend,
  display_order
)
values
  (
    'a0000001-0000-4000-8000-000000000001',
    'Lumière',
    'lumiere',
    'Light refracted through gold — an ode to Parisian dawn.',
    '/products/necklace-1.jpg',
    true,
    'published',
    'Lumière',
    'SS26',
    false,
    0
  ),
  (
    'a0000001-0000-4000-8000-000000000002',
    'Noir',
    'noir',
    'Sculpted darkness. Givenchy restraint in every facet.',
    '/products/necklace-2.jpg',
    true,
    'published',
    'Noir',
    'FW25',
    false,
    1
  ),
  (
    'a0000001-0000-4000-8000-000000000003',
    'Arc',
    'arc',
    'Geometry as ornament — minimal lines, maximum presence.',
    '/products/earrings-1.jpg',
    true,
    'published',
    'Arc',
    'SS25',
    false,
    2
  )
on conflict (slug) do update set
  publication_status = excluded.publication_status,
  hidden_from_frontend = excluded.hidden_from_frontend,
  cover_image = excluded.cover_image;

insert into public.products (
  id, name, slug, description, price, category, target_gender, stock, featured, new_in, collection_id, active, publication_status, hidden_from_frontend, archived
)
values
  (
    'b0000001-0000-4000-8000-000000000001',
    'Lumière Ring',
    'lumiere-ring',
    'A single line of light captured in gold — architectural, weightless, eternal.',
    4200,
    'rings',
    'women',
    10,
    true,
    true,
    'a0000001-0000-4000-8000-000000000001',
    true,
    'published',
    false,
    false
  ),
  (
    'b0000001-0000-4000-8000-000000000002',
    'Noir Pendant',
    'noir-pendant',
    'Sculpted darkness suspended on a whisper of chain — pure Saint Laurent restraint.',
    6800,
    'necklaces',
    'unisex',
    8,
    true,
    false,
    'a0000001-0000-4000-8000-000000000002',
    true,
    'published',
    false,
    false
  ),
  (
    'b0000001-0000-4000-8000-000000000003',
    'Arc Ear Cuff',
    'arc-ear-cuff',
    'An arc of metal that follows the ear''s natural geometry — Jacquemus clarity.',
    2900,
    'earrings',
    'women',
    12,
    true,
    false,
    'a0000001-0000-4000-8000-000000000003',
    true,
    'published',
    false,
    false
  ),
  (
    'b0000001-0000-4000-8000-000000000004',
    'Woven Bracelet',
    'woven-bracelet',
    'Intrecciato-inspired weave in precious metal — tactile, quiet, unmistakable.',
    5100,
    'bracelets',
    'men',
    6,
    true,
    false,
    null,
    true,
    'published',
    false,
    false
  )
on conflict (slug) do update set
  publication_status = excluded.publication_status,
  active = excluded.active,
  hidden_from_frontend = excluded.hidden_from_frontend,
  archived = excluded.archived;

insert into public.product_images (product_id, image_url, alt, position)
values
  ('b0000001-0000-4000-8000-000000000001', '/products/necklace-2.jpg', 'Lumière Ring', 0),
  ('b0000001-0000-4000-8000-000000000001', '/products/earrings-1.jpg', 'Lumière Ring detail', 1),
  ('b0000001-0000-4000-8000-000000000001', '/products/necklace-1.jpg', 'Lumière Ring alternate', 2),
  ('b0000001-0000-4000-8000-000000000002', '/products/necklace-1.jpg', 'Noir Pendant', 0),
  ('b0000001-0000-4000-8000-000000000002', '/products/necklace-2.jpg', 'Noir Pendant detail', 1),
  ('b0000001-0000-4000-8000-000000000003', '/products/earrings-1.jpg', 'Arc Ear Cuff', 0),
  ('b0000001-0000-4000-8000-000000000004', '/products/necklace-2.jpg', 'Woven Bracelet', 0)
on conflict (product_id, position) do nothing;

insert into public.homepage_settings (hero_video_url, featured_collection_id)
values ('/videos/hero.mp4', 'a0000001-0000-4000-8000-000000000001');

insert into public.homepage_new_in (product_id, position)
values
  ('b0000001-0000-4000-8000-000000000002', 0),
  ('b0000001-0000-4000-8000-000000000004', 1),
  ('b0000001-0000-4000-8000-000000000003', 2),
  ('b0000001-0000-4000-8000-000000000001', 3)
on conflict (position) do nothing;

insert into public.campaigns (image_url, position, active)
values
  ('/products/necklace-1.jpg', 0, true),
  ('/products/earrings-1.jpg', 1, true),
  ('/products/necklace-2.jpg', 2, true),
  ('/products/necklace-2.jpg', 3, true),
  ('/products/necklace-1.jpg', 4, true),
  ('/products/earrings-1.jpg', 5, true)
on conflict (position) do nothing;

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
