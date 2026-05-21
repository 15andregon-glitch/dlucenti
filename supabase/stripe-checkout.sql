-- =============================================================================
-- Stripe Checkout — extend orders for payment + storefront fulfillment
-- Run after finance.sql (orders / order_items already exist)
-- =============================================================================

alter table public.orders
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists customer_email text,
  add column if not exists customer_name text;

create unique index if not exists orders_stripe_session_id_unique
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;

create unique index if not exists orders_stripe_payment_intent_unique
  on public.orders (stripe_payment_intent)
  where stripe_payment_intent is not null;

-- Atomic stock decrement (never below zero)
create or replace function public.decrement_product_stock(
  p_product_id uuid,
  p_quantity integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_stock integer;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'invalid quantity';
  end if;

  update public.products
  set stock = greatest(0, coalesce(stock, 0) - p_quantity),
      updated_at = now()
  where id = p_product_id
  returning stock into new_stock;

  if not found then
    raise exception 'product not found';
  end if;

  return new_stock;
end;
$$;

revoke all on function public.decrement_product_stock(uuid, integer) from public;
grant execute on function public.decrement_product_stock(uuid, integer) to service_role;
