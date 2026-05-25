-- =============================================================================
-- Orders — fulfillment, shipping address, tracking, shipping email guard
-- Run after stripe-checkout.sql
-- =============================================================================

do $$ begin
  create type public.fulfillment_status as enum (
    'unfulfilled',
    'processing',
    'shipped'
  );
exception
  when duplicate_object then null;
end $$;

alter table public.orders
  add column if not exists fulfillment_status public.fulfillment_status not null default 'unfulfilled',
  add column if not exists shipping_address text,
  add column if not exists locale text not null default 'en',
  add column if not exists tracking_number text,
  add column if not exists courier text,
  add column if not exists tracking_url text,
  add column if not exists shipped_at timestamptz,
  add column if not exists shipping_email_sent_at timestamptz;

create index if not exists orders_fulfillment_status_idx
  on public.orders (fulfillment_status);
