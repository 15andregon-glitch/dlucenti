-- D'LUCENTI editorial visibility — CMS field semantics (see lib/product-editorial-visibility.ts)
-- Run in Supabase SQL Editor after products-storefront-visibility.sql

-- Mostrar na loja: undo mistaken hide on published catalog
update public.products
set hidden_from_frontend = false,
    active = true
where publication_status = 'published'
  and coalesce(archived, false) = false
  and hidden_from_frontend = true;

-- Homepage slots: ensure slotted products have "Mostrar na homepage" (featured)
update public.products p
set featured = true
where exists (
  select 1 from public.homepage_new_in h where h.product_id = p.id
)
  and coalesce(p.archived, false) = false
  and p.publication_status = 'published'
  and coalesce(p.hidden_from_frontend, false) = false;
