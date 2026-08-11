import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Item } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { ItemTypeBadge, ItemStatusBadge, ClaimStatusBadge } from "@/components/StatusBadge";
import ItemImage from "@/components/ItemImage";
import ClaimForm from "@/components/ClaimForm";
import { NeonMesh } from "@/components/ui/neon-mesh";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", params.id)
    .maybeSingle<Item>();

  if (error || !item) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingClaim: { status: string } | null = null;
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
    <>
      <NeonMesh variant="backdrop" />
      <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/browse" className="text-sm font-medium text-brand-400 hover:text-brand-300 hover:underline">
        ← Back to Browse
      </Link>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl shadow-black/40">
        <div className="relative h-64 w-full sm:h-80">
          <ItemImage src={item.image_url} alt={item.title} className="h-64 w-full object-cover sm:h-80" />
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <ItemTypeBadge type={item.type} />
            <ItemStatusBadge status={item.status} />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">{item.title}</h1>

          {item.description && <p className="text-gray-700">{item.description}</p>}

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Category</dt>
              <dd className="font-medium text-gray-900">{item.category}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Location</dt>
              <dd className="font-medium text-gray-900">{item.location || "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Item Date</dt>
              <dd className="font-medium text-gray-900">{formatDate(item.item_date)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium capitalize text-gray-900">{item.status}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Posted</dt>
              <dd className="font-medium text-gray-900">{formatDate(item.created_at)}</dd>
            </div>
          </dl>

          {isClaimable && (
            <div className="border-t border-gray-200 pt-4">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Is this yours?</h2>

              {isOwner ? (
                <p className="text-sm text-gray-500">This is your own listing.</p>
              ) : existingClaim ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>You already sent a claim for this item:</span>
                  <ClaimStatusBadge status={existingClaim.status as "pending" | "accepted" | "rejected"} />
                </div>
              ) : user ? (
                <ClaimForm itemId={item.id} />
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(`/items/${item.id}`)}`}
                  className="inline-block rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-brand-400"
                >
                  Log in to send a claim
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
