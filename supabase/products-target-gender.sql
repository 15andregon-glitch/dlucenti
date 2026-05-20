-- Product gender targeting for storefront shop navigation
-- Run after schema.sql on existing projects.

do $$ begin
  create type public.product_target_gender as enum ('women', 'men', 'unisex');
exception
  when duplicate_object then null;
end $$;

alter table public.products
  add column if not exists target_gender public.product_target_gender not null default 'unisex';

create index if not exists products_target_gender_idx on public.products (target_gender);

update public.products set target_gender = 'unisex' where target_gender is null;
