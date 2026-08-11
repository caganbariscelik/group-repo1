import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Item, ClaimStatus } from "@/lib/types/domain";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { ClaimStatusBadge } from "@/components/ui/Badge";

// Item is never actually null here (claims.item_id blocks item deletion via
// NO ACTION while claims exist — see 0001_init_schema.sql), but the type
// stays nullable defensively since it comes through a nested embed.
type SentClaim = {
  id: string;
  item_id: string;
  message: string;
  status: ClaimStatus;
  created_at: string;
  items:
    | (Item & {
        // Populated only once this claim is accepted — enforced by the
        // profiles_select_owner_via_accepted_claim RLS policy
        // (0003_claim_refinements.sql), not by client-side filtering.
        profiles: { id: string; name: string | null; email: string } | null;
      })
    | null;
};

export default async function SentClaimsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t, lang } = await getDictionary();

  if (!user) {
    redirect("/login?next=/sent-claims");
  }

  const { data: claims, error } = await supabase
    .from("claims")
    .select("*, items(*, profiles(id, name, email))")
    .eq("claimant_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SentClaim[]>();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-white">{t.sentClaims.title}</h1>
        <p className="text-sm text-slate-300">{t.sentClaims.description}</p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          {t.sentClaims.loadErrorPrefix}
          {error.message}
        </p>
      )}

      {!error && claims && claims.length === 0 && (
        <p className="rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-slate-300">
          {t.sentClaims.emptyStatePrefix}
          <Link href="/browse" className="font-medium text-white underline">
            {t.sentClaims.browseLink}
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {claims?.map((claim) => {
          const item = claim.items;
          const owner = claim.status === "accepted" ? item?.profiles : null;

          return (
            <div
              key={claim.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-20 sm:w-28">
                {item ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    {t.sentClaims.itemUnavailable}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={item ? `/items/${item.id}` : "#"}
                    className="font-medium text-slate-900 hover:text-slate-700"
                  >
                    {item?.title ?? t.sentClaims.itemUnavailable}
                  </Link>
                  <ClaimStatusBadge status={claim.status} t={t} />
                </div>

                {item?.location && <p className="text-sm text-slate-500">{item.location}</p>}

                <p className="text-sm text-slate-700">
                  <span className="font-medium">{t.sentClaims.yourMessageLabel} </span>
                  {claim.message}
                </p>

                <p className="text-xs text-slate-400">
                  {t.sentClaims.sentPrefix}{" "}
                  {formatDate(claim.created_at, lang === "tr" ? "tr-TR" : "en-US")}
                </p>

                {claim.status === "accepted" && owner && (
                  <div className="mt-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                    <p className="font-medium">{t.sentClaims.acceptedContactPrefix}</p>
                    <p>{owner.name}</p>
                    <p>{owner.email}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
