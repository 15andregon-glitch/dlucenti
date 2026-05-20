-- =============================================================================
-- Financial operations — income statement (DR) architecture
-- Run after schema.sql
-- =============================================================================

create type public.financial_category_group as enum (
  'revenue',
  'variable_cost',
  'fixed_cost',
  'depreciation',
  'financial',
  'extraordinary'
);

create type public.financial_entry_source as enum (
  'manual',
  'order',
  'inventory',
  'shipping',
  'import'
);

create type public.reporting_period_type as enum (
  'month',
  'quarter',
  'year'
);

-- ---------------------------------------------------------------------------
-- reporting_periods
-- ---------------------------------------------------------------------------

create table public.reporting_periods (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  year integer not null check (year >= 2000 and year <= 2100),
  month integer check (month is null or (month >= 1 and month <= 12)),
  quarter integer check (quarter is null or (quarter >= 1 and quarter <= 4)),
  period_type public.reporting_period_type not null default 'month',
  label text not null,
  starts_at date not null,
  ends_at date not null,
  is_closed boolean not null default false,
  constraint reporting_periods_label_unique unique (label)
);

create index reporting_periods_year_month_idx on public.reporting_periods (year, month);

-- ---------------------------------------------------------------------------
-- financial_categories (modular DR lines)
-- ---------------------------------------------------------------------------

create table public.financial_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  name_pt text not null default '',
  group_type public.financial_category_group not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  description text,
  constraint financial_categories_code_unique unique (code)
);

create index financial_categories_group_idx on public.financial_categories (group_type, sort_order);

-- ---------------------------------------------------------------------------
-- financial_entries
-- ---------------------------------------------------------------------------

create table public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  period_id uuid not null references public.reporting_periods (id) on delete cascade,
  category_id uuid not null references public.financial_categories (id) on delete restrict,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'EUR',
  source public.financial_entry_source not null default 'manual',
  source_ref text,
  description text,
  entry_date date not null default current_date
);

create index financial_entries_period_idx on public.financial_entries (period_id);
create index financial_entries_category_idx on public.financial_entries (category_id);
create index financial_entries_entry_date_idx on public.financial_entries (entry_date);

create trigger financial_entries_set_updated_at
before update on public.financial_entries
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- dr_snapshots (computed income statements)
-- ---------------------------------------------------------------------------

create table public.dr_snapshots (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.reporting_periods (id) on delete cascade,
  computed_at timestamptz not null default now(),
  snapshot jsonb not null,
  constraint dr_snapshots_period_unique unique (period_id)
);

-- ---------------------------------------------------------------------------
-- orders (ecommerce integration)
-- ---------------------------------------------------------------------------

create type public.order_status as enum (
  'pending',
  'paid',
  'shipped',
  'completed',
  'cancelled'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  order_number text not null,
  status public.order_status not null default 'pending',
  subtotal numeric(14, 2) not null default 0,
  shipping_cost numeric(14, 2) not null default 0,
  tax numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  currency text not null default 'EUR',
  period_id uuid references public.reporting_periods (id) on delete set null,
  synced_to_finance boolean not null default false,
  constraint orders_order_number_unique unique (order_number)
);

create index orders_status_idx on public.orders (status);
create index orders_created_at_idx on public.orders (created_at);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(14, 2) not null,
  unit_cost numeric(14, 2) not null default 0
);

-- ---------------------------------------------------------------------------
-- Seed financial categories
-- ---------------------------------------------------------------------------

insert into public.financial_categories (code, name, name_pt, group_type, sort_order) values
  ('sales_revenue', 'Sales revenue', 'Receitas de vendas', 'revenue', 10),
  ('service_revenue', 'Service revenue', 'Receitas de serviços', 'revenue', 20),
  ('cmvmc', 'Cost of goods sold', 'CMVMC', 'variable_cost', 30),
  ('variable_operational_costs', 'Variable operational costs', 'Custos operacionais variáveis', 'variable_cost', 40),
  ('fse', 'External supplies & services', 'FSE', 'fixed_cost', 50),
  ('staff_costs', 'Staff costs', 'Custos com pessoal', 'fixed_cost', 60),
  ('rent', 'Rent', 'Rendas', 'fixed_cost', 70),
  ('software', 'Software & subscriptions', 'Software', 'fixed_cost', 80),
  ('marketing', 'Marketing', 'Marketing', 'fixed_cost', 90),
  ('logistics', 'Logistics', 'Logística', 'fixed_cost', 100),
  ('depreciation', 'Depreciation', 'Depreciações', 'depreciation', 110),
  ('amortization', 'Amortization', 'Amortizações', 'depreciation', 120),
  ('interest', 'Interest expense', 'Juros', 'financial', 130),
  ('bank_fees', 'Bank fees', 'Comissões bancárias', 'financial', 140),
  ('leasing', 'Leasing', 'Leasing', 'financial', 150),
  ('extraordinary_income', 'Extraordinary income', 'Receitas extraordinárias', 'extraordinary', 160),
  ('extraordinary_expenses', 'Extraordinary expenses', 'Gastos extraordinários', 'extraordinary', 170)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.reporting_periods enable row level security;
alter table public.financial_categories enable row level security;
alter table public.financial_entries enable row level security;
alter table public.dr_snapshots enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "financial_categories_public_read"
on public.financial_categories for select to anon, authenticated using (true);

create policy "reporting_periods_admin"
on public.reporting_periods for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "financial_entries_admin"
on public.financial_entries for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "dr_snapshots_admin"
on public.dr_snapshots for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "orders_admin"
on public.orders for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy "order_items_admin"
on public.order_items for all to authenticated
using (exists (select 1 from public.admins a where a.id = auth.uid()))
with check (exists (select 1 from public.admins a where a.id = auth.uid()));
