-- One-time: make existing collections visible on /collections storefront
-- Run if the page shows "No collections published yet" but Admin → Collections has rows.

update public.collections
set
  publication_status = 'published',
  hidden_from_frontend = false,
  editorial_title = coalesce(nullif(trim(editorial_title), ''), name),
  short_title = coalesce(nullif(trim(short_title), ''), name)
where coalesce(trim(cover_image), '') <> '';

-- Verify:
-- select name, slug, publication_status, hidden_from_frontend from public.collections;
