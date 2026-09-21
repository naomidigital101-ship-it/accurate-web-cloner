begin;
create table if not exists public.book_orders (
  id uuid primary key default gen_random_uuid(),
  provider_transaction_id text not null unique,
  received_at timestamptz not null default now(),
  amount_agorot bigint not null check (amount_agorot > 0),
  shipping_agorot bigint check (shipping_agorot >= 0),
  shipping_method text not null default '',
  full_name text not null default '', phone text not null default '',
  email text not null default '', address text not null default '',
  description text not null default '', provider_payment_date text not null default '',
  payment_method text not null default '', products jsonb not null default '[]',
  fulfillment text not null default 'new' check (fulfillment in ('new','processing','fulfilled'))
);
create index if not exists book_orders_received_idx on public.book_orders(received_at desc);
alter table public.book_orders enable row level security;
revoke all on public.book_orders from anon, authenticated;
grant all on public.book_orders to service_role;
create table if not exists public.payment_webhook_config (
  id text primary key, secret_hash text not null,
  last_received_at timestamptz
);
alter table public.payment_webhook_config enable row level security;
revoke all on public.payment_webhook_config from anon, authenticated;
grant all on public.payment_webhook_config to service_role;
commit;
