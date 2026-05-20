-- Product financial & inventory fields (run after schema.sql)

create type public.product_publication_status as enum ('draft', 'published');

alter table public.products
  add column if not exists publication_status public.product_publication_status not null default 'draft',
  add column if not exists materials text not null default '',
  add column if not exists dimensions text not null default '',
  add column if not exists product_cost numeric(12, 2) not null default 0 check (product_cost >= 0),
  add column if not exists packaging_cost numeric(12, 2) not null default 0 check (packaging_cost >= 0),
  add column if not exists pouch_cost numeric(12, 2) not null default 0 check (pouch_cost >= 0),
  add column if not exists shipping_cost numeric(12, 2) not null default 0 check (shipping_cost >= 0),
  add column if not exists payment_fee_percent numeric(5, 2) not null default 2.9 check (payment_fee_percent >= 0),
  add column if not exists import_cost numeric(12, 2) not null default 0 check (import_cost >= 0),
  add column if not exists vat_rate numeric(5, 2) not null default 23 check (vat_rate >= 0 and vat_rate <= 100),
  add column if not exists supplier_name text not null default '',
  add column if not exists supplier_reference text not null default '',
  add column if not exists target_margin_percent numeric(5, 2),
  add column if not exists sku text,
  add column if not exists barcode text,
  add column if not exists minimum_stock integer not null default 0 check (minimum_stock >= 0),
  add column if not exists reserved_stock integer not null default 0 check (reserved_stock >= 0),
  add column if not exists lead_time_days integer not null default 0 check (lead_time_days >= 0),
  add column if not exists warehouse_location text not null default '',
  add column if not exists total_cost numeric(12, 2) not null default 0 check (total_cost >= 0),
  add column if not exists gross_margin_percent numeric(7, 2) not null default 0,
  add column if not exists estimated_net_profit numeric(12, 2) not null default 0;

create unique index if not exists products_sku_unique on public.products (sku) where sku is not null;

comment on column public.products.price is 'Selling price (EUR)';
comment on column public.products.shipping_cost is 'Estimated shipping cost per unit';
