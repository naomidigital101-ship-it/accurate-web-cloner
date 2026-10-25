begin;
alter table public.book_orders add column if not exists delivery_revision integer not null default 0;

-- Serialize retries on the unique transaction. Only fill missing delivery fields;
-- never change payment totals, customer edits, fulfillment, or the original date.
create or replace function public.record_grow_order(payment jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare saved public.book_orders; incoming public.book_orders;
begin
  incoming := jsonb_populate_record(null::public.book_orders, payment);
  insert into public.book_orders (
    provider_transaction_id, amount_agorot, shipping_agorot, shipping_method,
    full_name, phone, email, address, description, provider_payment_date, payment_method, products
  ) values (
    incoming.provider_transaction_id, incoming.amount_agorot, incoming.shipping_agorot, incoming.shipping_method,
    incoming.full_name, incoming.phone, incoming.email, incoming.address, incoming.description,
    incoming.provider_payment_date, incoming.payment_method, incoming.products
  ) on conflict (provider_transaction_id) do nothing;
  select * into strict saved from public.book_orders
    where provider_transaction_id = incoming.provider_transaction_id for update;
  if (btrim(saved.address) = '' and btrim(incoming.address) <> '')
    or (btrim(saved.shipping_method) = '' and btrim(incoming.shipping_method) <> '')
    or (saved.shipping_agorot is null and incoming.shipping_agorot is not null) then
    update public.book_orders set
      address = case when btrim(saved.address) = '' then incoming.address else saved.address end,
      shipping_method = case when btrim(saved.shipping_method) = '' then incoming.shipping_method else saved.shipping_method end,
      shipping_agorot = coalesce(saved.shipping_agorot, incoming.shipping_agorot),
      delivery_revision = saved.delivery_revision + 1
    where id = saved.id returning * into saved;
  end if;
  return to_jsonb(saved);
end;
$$;
revoke all on function public.record_grow_order(jsonb) from public, anon, authenticated;
grant execute on function public.record_grow_order(jsonb) to service_role;
commit;
