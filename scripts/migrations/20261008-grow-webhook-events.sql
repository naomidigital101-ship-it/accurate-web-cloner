-- Every authenticated Grow delivery, redacted (no card data, tokens or webhook key).
-- Lets staff prove a purchase arrived from Grow and diagnose any rejected notification.
begin;
create table if not exists public.grow_webhook_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  received_at timestamptz not null default now(),
  outcome text not null,
  transaction_id text,
  user_agent text, client_ip text, content_type text,
  diagnostics jsonb, payload jsonb
);
create index if not exists grow_webhook_events_received_idx on public.grow_webhook_events(received_at desc);
alter table public.grow_webhook_events enable row level security;
revoke all on public.grow_webhook_events from anon, authenticated;
grant all on public.grow_webhook_events to service_role;
commit;
