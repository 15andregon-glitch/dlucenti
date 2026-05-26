-- =============================================================================
-- Ring sizes — product_variants + order_items variant fields + stock RPC
-- Run after finance.sql / stripe-checkout.sql
-- =============================================================================

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  variant_type text not null default 'ring_size',
  label text not null,
  sku text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_type_label_unique unique (product_id, variant_type, label)
);

create index if not exists product_variants_product_id_idx
  on public.product_variants (product_id);

create index if not exists product_variants_product_active_idx
  on public.product_variants (product_id, is_active, sort_order);

alter table public.order_items
  add column if not exists variant_id uuid references public.product_variants (id) on delete set null,
  add column if not exists selected_variant_type text,
  add column if not exists selected_variant_label text,
  add column if not exists selected_variant_sku text;

-- Decrement variant stock and sync parent product aggregate stock (active variants only)
create or replace function public.decrement_product_variant_stock(
  p_variant_id uuid,
  p_quantity integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_stock integer;
  v_product_id uuid;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'invalid quantity';
  end if;

  update public.product_variants
  set stock_quantity = greatest(0, stock_quantity - p_quantity),
      updated_at = now()
  where id = p_variant_id
  returning stock_quantity, product_id into new_stock, v_product_id;

  if not found then
    raise exception 'variant not found';
  end if;

  update public.products
  set stock = coalesce(
        (
          select sum(stock_quantity)
          from public.product_variants
          where product_id = v_product_id
            and is_active = true
        ),
        0
      ),
      updated_at = now()
  where id = v_product_id;

  return new_stock;
end;
$$;

revoke all on function public.decrement_product_variant_stock(uuid, integer) from public;
grant execute on function public.decrement_product_variant_stock(uuid, integer) to service_role;

alter table public.product_variants enable row level security;
