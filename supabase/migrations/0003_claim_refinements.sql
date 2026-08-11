-- Campus Lost & Found — incremental refinements merged in from Student 2's
-- draft schema. Builds on 0001_init_schema.sql (already applied) — see that
-- file for why claim status changes only happen through accept_claim/
-- reject_claim RPCs rather than direct UPDATE, and why profiles.name starts
-- out null. This migration only adds the parts of Student 2's design that
-- don't conflict with those decisions:
--   1. A claimant can read the item owner's profile (name + email) once
--      their claim on that owner's item has been accepted — lets the
--      claimant know who to contact / where to pick the item up.
--   2. A claimant can't submit more than one claim on the same item.
--   3. A user can't submit a claim on their own found item.

-- 1. Claimant -> owner contact info, accepted claims only.
create policy "profiles_select_owner_via_accepted_claim"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      join public.items i on i.id = c.item_id
      where i.owner_id = profiles.id
        and c.claimant_id = auth.uid()
        and c.status = 'accepted'
    )
  );

-- 2. One claim per (item, claimant).
alter table public.claims
  add constraint claims_item_claimant_unique unique (item_id, claimant_id);

-- 3. Claims must target a found+open item that isn't the claimant's own.
create or replace function public.enforce_claim_target()
returns trigger
language plpgsql
as $$
declare
  v_type item_type;
  v_status item_status;
  v_owner_id uuid;
begin
  select type, status, owner_id into v_type, v_status, v_owner_id
  from public.items where id = new.item_id;

  if v_type is null then
    raise exception 'Item does not exist';
  end if;
  if v_type <> 'found' then
    raise exception 'Claims can only be submitted for found items';
  end if;
  if v_status <> 'open' then
    raise exception 'Claims can only be submitted for open items';
  end if;
  if v_owner_id = new.claimant_id then
    raise exception 'You cannot claim your own item';
  end if;

  return new;
end;
$$;
