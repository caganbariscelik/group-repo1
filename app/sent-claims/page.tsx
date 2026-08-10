import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ClaimWithOwner } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { ClaimStatusBadge } from "@/components/StatusBadge";
import ItemImage from "@/components/ItemImage";

export const dynamic = "force-dynamic";

export default async function SentClaimsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/sent-claims");
  }

  const { data: claims, error } = await supabase
    .from("claims")
    .select("*, items(*, profiles(id, name, email))")
    .eq("claimant_id", user.id)
    .order("created_at", { ascending: false })
    .returns<ClaimWithOwner[]>();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Sent Claims</h1>
        <p className="text-sm text-gray-500">Claims you&apos;ve sent for found items.</p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t load your claims: {error.message}
        </p>
      )}

      {!error && claims && claims.length === 0 && (
        <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          You haven&apos;t sent any claims yet.{" "}
          <Link href="/browse" className="font-medium text-brand-600 hover:underline">
            Browse items
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
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row"
            >
              <ItemImage
                src={item?.image_url ?? null}
                alt={item?.title ?? "Item"}
                className="h-24 w-full rounded-md object-cover sm:h-20 sm:w-28"
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={item ? `/items/${item.id}` : "#"}
                    className="font-medium text-gray-900 hover:text-brand-700"
                  >
                    {item?.title ?? "Item no longer available"}
                  </Link>
                  <ClaimStatusBadge status={claim.status} />
                </div>

                {item?.location && <p className="text-sm text-gray-500">📍 {item.location}</p>}

                <p className="text-sm text-gray-700">
                  <span className="font-medium">Your message: </span>
                  {claim.message}
                </p>

                <p className="text-xs text-gray-400">Sent {formatDate(claim.created_at)}</p>

                {claim.status === "accepted" && owner && (
                  <div className="mt-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                    <p className="font-medium">Claim accepted — contact the owner:</p>
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
