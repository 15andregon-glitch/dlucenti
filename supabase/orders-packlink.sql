-- =============================================================================
-- Orders — Packlink / fulfillment fields (quotes only; labels not auto-bought)
-- Run after orders-fulfillment.sql
-- =============================================================================

alter table public.orders
  add column if not exists packlink_service_id text,
  add column if not exists label_url text;

-- courier, tracking_number, tracking_url already exist from orders-fulfillment.sql
