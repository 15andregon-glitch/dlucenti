-- =============================================================================
-- Orders / order_items profitability fields for threshold-based free shipping
-- =============================================================================

alter table public.orders
  add column if not exists customer_shipping_paid numeric(10,2) not null default 0,
  add column if not exists real_shipping_cost numeric(10,2) not null default 0,
  add column if not exists store_shipping_subsidy numeric(10,2) not null default 0,
  add column if not exists free_shipping_applied boolean not null default false,
  add column if not exists selected_free_shipping_service text,
  add column if not exists selected_free_shipping_carrier text,
  add column if not exists packaging_cost numeric(10,2) not null default 0,
  add column if not exists total_operational_cost numeric(10,2) not null default 0,
  add column if not exists estimated_profit numeric(10,2) not null default 0,
  add column if not exists estimated_margin numeric(6,2) not null default 0;

alter table public.order_items
  add column if not exists allocated_shipping_cost numeric(10,2) not null default 0,
  add column if not exists allocated_total_cost numeric(10,2) not null default 0,
  add column if not exists estimated_item_profit numeric(10,2) not null default 0,
  add column if not exists estimated_item_margin numeric(6,2) not null default 0;
