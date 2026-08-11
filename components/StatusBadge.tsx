import type { ClaimStatus, ItemStatus, ItemType } from "@/lib/types";

const ITEM_TYPE_STYLES: Record<ItemType, string> = {
  lost: "bg-red-100 text-red-700",
  found: "bg-green-100 text-green-700",
};

export function ItemTypeBadge({ type }: { type: ItemType }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${ITEM_TYPE_STYLES[type]}`}
    >
      {type}
    </span>
  );
}

const ITEM_STATUS_STYLES: Partial<Record<ItemStatus, string>> = {
  claimed: "bg-amber-100 text-amber-800",
  returned: "bg-gray-200 text-gray-700",
  closed: "bg-gray-200 text-gray-700",
};

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  if (status === "open") return null;

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${ITEM_STATUS_STYLES[status]}`}
    >
      {status === "claimed" ? "Claimed" : status === "returned" ? "Returned" : "Closed"}
    </span>
  );
}

const CLAIM_STATUS_STYLES: Record<ClaimStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${CLAIM_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
