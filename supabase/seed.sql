-- =============================================================================
-- Optional seed — maps existing local /public assets to CMS rows
-- Adjust URLs after uploading assets to Supabase Storage
-- =============================================================================

insert into public.collections (id, name, slug, description, cover_image, featured)
values
  (
    'a0000001-0000-4000-8000-000000000001',
    'Lumière',
    'lumiere',
    'Light refracted through gold — an ode to Parisian dawn.',
    '/campaigns/lumiere-cover.jpg',
    true
  ),
  (
    'a0000001-0000-4000-8000-000000000002',
    'Noir',
    'noir',
    'Sculpted darkness. Givenchy restraint in every facet.',
    '/campaigns/noir-cover.jpg',
    true
  ),
  (
    'a0000001-0000-4000-8000-000000000003',
    'Arc',
    'arc',
    'Geometry as ornament — minimal lines, maximum presence.',
    '/campaigns/arc-cover.jpg',
    true
  )
on conflict (slug) do nothing;

insert into public.products (
  id, name, slug, description, price, category, stock, featured, new_in, collection_id, active
)
values
  (
    'b0000001-0000-4000-8000-000000000001',
    'Lumière Ring',
    'lumiere-ring',
    'A single line of light captured in gold — architectural, weightless, eternal.',
    4200,
    'rings',
    10,
    true,
    true,
    'a0000001-0000-4000-8000-000000000001',
    true
  ),
  (
    'b0000001-0000-4000-8000-000000000002',
    'Noir Pendant',
    'noir-pendant',
    'Sculpted darkness suspended on a whisper of chain — pure Saint Laurent restraint.',
    6800,
    'necklaces',
    8,
    true,
    false,
    'a0000001-0000-4000-8000-000000000002',
    true
  ),
  (
    'b0000001-0000-4000-8000-000000000003',
    'Arc Ear Cuff',
    'arc-ear-cuff',
    'An arc of metal that follows the ear''s natural geometry — Jacquemus clarity.',
    2900,
    'earrings',
    12,
    true,
    false,
    'a0000001-0000-4000-8000-000000000003',
    true
  ),
  (
    'b0000001-0000-4000-8000-000000000004',
    'Woven Bracelet',
    'woven-bracelet',
    'Intrecciato-inspired weave in precious metal — tactile, quiet, unmistakable.',
    5100,
    'bracelets',
    6,
    true,
    false,
    null,
    true
  )
on conflict (slug) do nothing;

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
