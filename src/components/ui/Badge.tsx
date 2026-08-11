import type { ItemStatus, ItemType, ClaimStatus } from "@/lib/types/domain";
import type { Dictionary } from "@/lib/i18n/dictionary";

const ITEM_STATUS_CLASSES: Record<ItemStatus, string> = {
  open: "bg-emerald-50 text-emerald-700",
  claimed: "bg-amber-50 text-amber-700",
  returned: "bg-slate-100 text-slate-600",
  closed: "bg-slate-100 text-slate-500",
};

const CLAIM_STATUS_CLASSES: Record<ClaimStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

const ITEM_TYPE_CLASSES: Record<ItemType, string> = {
  lost: "bg-red-50 text-red-700",
  found: "bg-indigo-50 text-indigo-700",
};

function BaseBadge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, t }: { status: ItemStatus; t: Dictionary }) {
  return <BaseBadge className={ITEM_STATUS_CLASSES[status]}>{t.itemStatus[status]}</BaseBadge>;
}

export function ClaimStatusBadge({ status, t }: { status: ClaimStatus; t: Dictionary }) {
  return (
    <BaseBadge className={CLAIM_STATUS_CLASSES[status]}>{t.claimStatus[status]}</BaseBadge>
  );
}

export function TypeBadge({ type, t }: { type: ItemType; t: Dictionary }) {
  return <BaseBadge className={ITEM_TYPE_CLASSES[type]}>{t.itemType[type]}</BaseBadge>;
}
