-- =============================================================================
-- Orders — pickup point delivery (Packlink parcel-shop services)
-- Run after orders-packlink.sql
-- =============================================================================

alter table public.orders
  add column if not exists shipping_service_name text,
  add column if not exists delivery_type text,
  add column if not exists pickup_point_id text,
  add column if not exists pickup_point_name text,
  add column if not exists pickup_point_address text;
