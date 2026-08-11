# Campus Lost & Found

Shared Next.js + Supabase app for the campus Lost & Found group project.

- **Student 1** (owner side): Report Item, My Listings, accept/reject claims.
- **Student 2** (this branch, `student2`): Browse, Search/Filter, Item Detail, Claim submission, Sent Claims, Accepted-claim owner contact.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase project's URL and anon key (Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Apply the schema in `supabase/migrations/0001_init.sql` to your Supabase project (SQL Editor, or `supabase db push` if using the CLI). It creates `profiles`, `items`, `claims`, all RLS policies, and the triggers that:

- auto-create a `profiles` row on signup,
- flip an item to `claimed` when one of its claims is accepted.

Then run the app:

```bash
npm run dev
```

## Student 2 routes

| Route | Access | Description |
|---|---|---|
| `/browse` | public | Search/filter/sort open & claimed items |
| `/items/[id]` | public | Item detail; Claim form for found+open items |
| `/sent-claims` | logged in | Your sent claims + owner contact once accepted |
| `/login`, `/signup` | public | Email/password auth |

Security (self-claim/duplicate-claim/lost-item-claim prevention, and owner email never leaking to public queries) is enforced at the database level via Postgres RLS policies and constraints, not just in the UI — see `supabase/migrations/0001_init.sql`.
