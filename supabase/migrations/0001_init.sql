-- Campus Lost & Found — initial schema + RLS
-- Shared by both students (Student 1: listings/owner side, Student 2: discover/claim side).
-- Status values are stored lowercase; the spec's mixed-case bullet lists (e.g. "closed",
-- "rejected") are treated as the same enum, just written inconsistently in the brief.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Users can always read their own profile.
create policy "profiles_select_self"
  on profiles for select
  using (auth.uid() = id);

-- A claimant may read the owner's profile (name + email) ONLY once they have
-- an accepted claim on one of that owner's items. This is what powers
-- "Accepted Claim -> Owner Contact" without ever exposing emails publicly.
create policy "profiles_select_owner_via_accepted_claim"
  on profiles for select
  using (
    exists (
      select 1
      from claims c
      join items i on i.id = c.item_id
      where i.owner_id = profiles.id
        and c.claimant_id = auth.uid()
        and c.status = 'accepted'
    )
  );

create policy "profiles_update_self"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------------------------------------------------------------------------
-- items
-- ---------------------------------------------------------------------------
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('lost', 'found')),
  title text not null,
  description text,
  category text not null check (
    category in (
      'Electronics', 'Wallet / Money', 'Keys', 'Bag',
      'Clothing', 'Books', 'ID / Cards', 'Accessories', 'Other'
    )
  ),
  location text,
  item_date date,
  image_url text,
  status text not null default 'open' check (status in ('open', 'claimed', 'returned', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_status_idx on items (status);
create index if not exists items_type_idx on items (type);
create index if not exists items_category_idx on items (category);
create index if not exists items_created_at_idx on items (created_at desc);

alter table items enable row level security;

-- Items are public: anyone (including anon/logged-out) can read them.
-- Status-based visibility (e.g. hiding returned/closed on Browse) is an
-- application-level query filter, not an RLS restriction, so Item Detail
-- links still work for any status.
create policy "items_select_public"
  on items for select
  using (true);

-- Owner-side policies (needed for Student 1's Report Item / My Listings, and
-- for the accept/reject-claim trigger below to be allowed to update status).
create policy "items_insert_own"
  on items for insert
  with check (auth.uid() = owner_id);

create policy "items_update_own"
  on items for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "items_delete_own"
  on items for delete
  using (auth.uid() = owner_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_set_updated_at on items;
create trigger items_set_updated_at
  before update on items
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------------------------
-- claims
-- ---------------------------------------------------------------------------
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  claimant_id uuid not null references profiles (id) on delete cascade,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (item_id, claimant_id)
);

create index if not exists claims_claimant_idx on claims (claimant_id);
create index if not exists claims_item_idx on claims (item_id);

alter table claims enable row level security;

-- A user can only see their own sent claims...
create policy "claims_select_own"
  on claims for select
  using (auth.uid() = claimant_id);

-- ...or claims sent to items they own (needed for the owner's accept/reject UI).
create policy "claims_select_for_owned_items"
  on claims for select
  using (
    exists (
      select 1 from items i
      where i.id = claims.item_id
        and i.owner_id = auth.uid()
    )
  );

-- A user may only create a claim as themself, and only on a found+open item
-- that isn't their own listing. This backs up the client-side rules in
-- section 9 of the brief at the database level.
create policy "claims_insert_own"
  on claims for insert
  with check (
    auth.uid() = claimant_id
    and exists (
      select 1 from items i
      where i.id = item_id
        and i.type = 'found'
        and i.status = 'open'
        and i.owner_id <> auth.uid()
    )
  );

-- Only the item owner can change a claim's status (accept/reject).
create policy "claims_update_by_item_owner"
  on claims for update
  using (
    exists (
      select 1 from items i
      where i.id = claims.item_id
        and i.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from items i
      where i.id = claims.item_id
        and i.owner_id = auth.uid()
    )
  );

-- When a claim is accepted, flip the item to "claimed" automatically.
create or replace function handle_claim_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted' then
    update items set status = 'claimed' where id = new.item_id and status = 'open';
  end if;
  return new;
end;
$$;

drop trigger if exists on_claim_status_change on claims;
create trigger on_claim_status_change
  after update on claims
  for each row execute procedure handle_claim_status_change();
