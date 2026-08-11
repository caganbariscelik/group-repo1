-- Campus Lost & Found — core schema, RLS, and claim-lifecycle RPCs.
-- Owned by Student 1. Student 2: add a new numbered migration file for anything
-- extra you need rather than editing this one — the contract you can rely on:
--   * public.items is readable by anon + authenticated (no auth needed to browse)
--   * public.profiles_public(id, name) is readable by anyone (no email)
--   * item_status enum: open | claimed | returned | closed
--   * claim_status enum: pending | accepted | rejected
--   * claims can only be inserted for items where type = 'found' and status = 'open'
--     (enforced by trigger trg_enforce_claim_target)

create extension if not exists pgcrypto;

create type item_type as enum ('lost', 'found');
create type item_status as enum ('open', 'claimed', 'returned', 'closed');
create type claim_status as enum ('pending', 'accepted', 'rejected');

create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text,
  created_at timestamptz not null default now()
);

create table public.items (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  type        item_type not null,
  title       text not null,
  description text not null,
  category    text not null check (category in (
    'Electronics','Wallet / Money','Keys','Bag','Clothing',
    'Books','ID / Cards','Accessories','Other'
  )),
  location    text not null,
  item_date   date not null,
  image_url   text not null,
  status      item_status not null default 'open',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.claims (
  id           uuid primary key default gen_random_uuid(),
  item_id      uuid not null references public.items(id),        -- NO ACTION: blocks item delete while claims exist
  claimant_id  uuid not null references public.profiles(id) on delete cascade,
  message      text not null,
  status       claim_status not null default 'pending',
  created_at   timestamptz not null default now()
);

create index idx_items_owner_id on public.items(owner_id);
create index idx_items_status   on public.items(status);
create index idx_items_type     on public.items(type);
create index idx_claims_item_id on public.claims(item_id);
create index idx_claims_claimant_id on public.claims(claimant_id);
create index idx_claims_status on public.claims(status);

-- Auto-create a profile row when a new auth user signs up (name stays null
-- until they complete /profile-setup).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

-- Enforces the item status state machine at the DB level so that status
-- can never be changed through the normal edit form, only through the
-- dedicated close/returned/accept-claim code paths.
create or replace function public.validate_item_status_transition()
returns trigger
language plpgsql
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if old.status in ('closed', 'returned') then
    raise exception 'Cannot change status of a % item', old.status;
  end if;

  if new.status = 'returned' then
    if new.type = 'lost' and old.status <> 'open' then
      raise exception 'Lost items must be open before being marked returned';
    end if;
    if new.type = 'found' and old.status <> 'claimed' then
      raise exception 'Found items must be claimed before being marked returned';
    end if;
  elsif new.status = 'claimed' and old.status <> 'open' then
    raise exception 'Item must be open to become claimed';
  elsif new.status = 'closed' and old.status <> 'open' then
    raise exception 'Only open items can be closed';
  end if;

  return new;
end;
$$;

create trigger trg_validate_item_status
before update on public.items
for each row execute function public.validate_item_status_transition();

-- Claims may only target found items that are still open.
create or replace function public.enforce_claim_target()
returns trigger
language plpgsql
as $$
declare
  v_type item_type;
  v_status item_status;
begin
  select type, status into v_type, v_status from public.items where id = new.item_id;

  if v_type is null then
    raise exception 'Item does not exist';
  end if;
  if v_type <> 'found' then
    raise exception 'Claims can only be submitted for found items';
  end if;
  if v_status <> 'open' then
    raise exception 'Claims can only be submitted for open items';
  end if;

  return new;
end;
$$;

create trigger trg_enforce_claim_target
before insert on public.claims
for each row execute function public.enforce_claim_target();

alter table public.profiles enable row level security;
alter table public.items    enable row level security;
alter table public.claims   enable row level security;

-- profiles: self-row only (keeps email private; names are exposed via the
-- profiles_public view below)
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- items: public read (Browse works without login), owner-only write
create policy "items_select_all" on public.items
  for select to anon, authenticated using (true);

create policy "items_insert_own" on public.items
  for insert to authenticated with check (auth.uid() = owner_id);

create policy "items_update_own" on public.items
  for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "items_delete_own" on public.items
  for delete to authenticated using (auth.uid() = owner_id);
  -- claims.item_id FK (NO ACTION) blocks this if the item has any claims

-- claims: claimant sees their own claims, item owner sees claims on their
-- items. No UPDATE/DELETE policy at all — status only changes through the
-- accept_claim/reject_claim RPCs below, so it's always atomic and owner-checked.
create policy "claims_select_own_or_owned_item" on public.claims
  for select to authenticated using (
    auth.uid() = claimant_id
    or auth.uid() = (select owner_id from public.items where items.id = claims.item_id)
  );

create policy "claims_insert_own" on public.claims
  for insert to authenticated with check (auth.uid() = claimant_id);

-- Name-only public directory (no email) for cross-user display.
create view public.profiles_public
with (security_invoker = false) as
select id, name from public.profiles;

-- Item-owner's view of incoming claims. Nulls the claimant's email until
-- the claim is accepted (privacy requirement), and is already scoped to
-- "my items" via the WHERE clause (view runs as owner, so it can't rely on
-- profiles/claims RLS — the filter is explicit here instead).
create view public.owner_claim_details
with (security_invoker = false) as
select
  c.id as claim_id,
  c.item_id,
  c.status as claim_status,
  c.message,
  c.created_at,
  p.name as claimant_name,
  case when c.status = 'accepted' then p.email else null end as claimant_email,
  i.owner_id
from public.claims c
join public.items i on i.id = c.item_id
join public.profiles p on p.id = c.claimant_id
where i.owner_id = auth.uid();

create or replace function public.reject_claim(p_claim_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  select i.owner_id into v_owner_id
  from public.claims c join public.items i on i.id = c.item_id
  where c.id = p_claim_id
  for update of c;

  if v_owner_id is null then
    raise exception 'Claim not found';
  end if;
  if v_owner_id <> auth.uid() then
    raise exception 'Not authorized';
  end if;

  update public.claims set status = 'rejected'
  where id = p_claim_id and status = 'pending';
end;
$$;

-- Atomic accept: selected claim -> accepted, item -> claimed, every other
-- pending claim on the same item -> rejected. All-or-nothing in one call.
create or replace function public.accept_claim(p_claim_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item_id uuid;
  v_owner_id uuid;
  v_claim_status claim_status;
begin
  select c.item_id, i.owner_id, c.status
  into v_item_id, v_owner_id, v_claim_status
  from public.claims c join public.items i on i.id = c.item_id
  where c.id = p_claim_id
  for update of c, i;

  if v_item_id is null then
    raise exception 'Claim not found';
  end if;
  if v_owner_id <> auth.uid() then
    raise exception 'Not authorized';
  end if;
  if v_claim_status <> 'pending' then
    raise exception 'Claim is not pending';
  end if;

  update public.claims set status = 'accepted' where id = p_claim_id;

  update public.claims set status = 'rejected'
  where item_id = v_item_id and id <> p_claim_id and status = 'pending';

  update public.items set status = 'claimed', updated_at = now()
  where id = v_item_id;
end;
$$;

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.items to authenticated;
grant select on public.items to anon;

grant select, insert on public.claims to authenticated;   -- no update/delete: RPCs only

grant select, insert, update on public.profiles to authenticated;

grant select on public.profiles_public to anon, authenticated;
grant select on public.owner_claim_details to authenticated;

revoke all on function public.accept_claim(uuid) from public;
revoke all on function public.reject_claim(uuid) from public;
grant execute on function public.accept_claim(uuid) to authenticated;
grant execute on function public.reject_claim(uuid) to authenticated;
