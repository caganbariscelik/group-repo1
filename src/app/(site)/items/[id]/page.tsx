import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Item } from "@/lib/types/domain";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { TypeBadge, StatusBadge, ClaimStatusBadge } from "@/components/ui/Badge";
import { ClaimForm } from "@/components/items/ClaimForm";
import { Button } from "@/components/ui/Button";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t, lang } = await getDictionary();

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle<Item>();

  if (error || !item) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingClaim: { status: "pending" | "accepted" | "rejected" } | null = null;
  if (user) {
    const { data } = await supabase
      .from("claims")
      .select("status")
      .eq("item_id", item.id)
      .eq("claimant_id", user.id)
      .maybeSingle();
    existingClaim = data;
  }

  const isOwner = user?.id === item.owner_id;
  const isClaimable = item.type === "found" && item.status === "open";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <Link
        href="/browse"
        className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
      >
        {t.itemDetail.backToBrowse}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-xl">
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={item.type} t={t} />
            <StatusBadge status={item.status} t={t} />
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">{item.title}</h1>

          {item.description && <p className="text-slate-700">{item.description}</p>}

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">{t.itemForm.categoryLabel}</dt>
              <dd className="font-medium text-slate-900">{t.categories[item.category]}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.itemForm.locationLabel}</dt>
              <dd className="font-medium text-slate-900">{item.location || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.itemForm.dateLabel}</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(item.item_date, lang === "tr" ? "tr-TR" : "en-US")}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">{t.itemDetail.posted}</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(item.created_at, lang === "tr" ? "tr-TR" : "en-US")}
              </dd>
            </div>
          </dl>

          {isClaimable && (
            <div className="border-t border-slate-200 pt-4">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t.itemDetail.isThisYours}
              </h2>

              {isOwner ? (
                <p className="text-sm text-slate-500">{t.itemDetail.ownListingNote}</p>
              ) : existingClaim ? (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span>{t.itemDetail.alreadyClaimedPrefix}</span>
                  <ClaimStatusBadge status={existingClaim.status} t={t} />
                </div>
              ) : user ? (
                <ClaimForm itemId={item.id} t={t} />
              ) : (
                <Link href={`/login?next=${encodeURIComponent(`/items/${item.id}`)}`}>
                  <Button>{t.itemDetail.loginToClaimBtn}</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
