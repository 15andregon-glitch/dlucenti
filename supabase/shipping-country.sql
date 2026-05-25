-- =============================================================================
-- Orders — shipping country (ISO 3166-1 alpha-2 from Stripe checkout)
-- Run after orders-fulfillment.sql
-- =============================================================================

alter table public.orders
  add column if not exists shipping_country text;

create index if not exists orders_shipping_country_idx
  on public.orders (shipping_country)
  where shipping_country is not null;
