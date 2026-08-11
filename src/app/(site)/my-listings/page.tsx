import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/my-listings/ListingCard";
import { ListingActions } from "@/components/my-listings/ListingActions";
import { ClaimsPanel } from "@/components/my-listings/ClaimsPanel";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { Item, OwnerClaimDetail } from "@/lib/types/domain";
import { getDictionary } from "@/lib/i18n/server";

export default async function MyListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorMessage } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getDictionary();

  if (!user) {
    redirect("/login?next=/my-listings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  if (!profile?.name) {
    redirect("/profile-setup?next=/my-listings");
  }

  const [{ data: items }, { data: ownerClaims }] = await Promise.all([
    supabase
      .from("items")
      .select("*, claims(count)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("owner_claim_details").select("*"),
  ]);

  const claimsByItem = new Map<string, OwnerClaimDetail[]>();
  for (const claim of ownerClaims ?? []) {
    const list = claimsByItem.get(claim.item_id) ?? [];
    list.push(claim);
    claimsByItem.set(claim.item_id, list);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">{t.myListings.title}</h1>
        <Link href="/report">
          <Button>{t.myListings.reportBtn}</Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="mt-4">
          <Alert variant="error">{errorMessage}</Alert>
        </div>
      )}

      {!items || items.length === 0 ? (
        <p className="mt-8 text-sm text-slate-300">{t.myListings.emptyState}</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {items.map((row) => {
            const item = row as unknown as Item & {
              claims: { count: number }[];
            };
            const claimCount = item.claims?.[0]?.count ?? 0;
            return (
              <li key={item.id}>
                <ListingCard item={item} t={t}>
                  <ListingActions item={item} claimCount={claimCount} t={t} />
                  {item.type === "found" && (
                    <ClaimsPanel claims={claimsByItem.get(item.id) ?? []} t={t} />
                  )}
                </ListingCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
