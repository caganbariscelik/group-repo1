import Link from "next/link";
import { closeItem, deleteItem, markReturned } from "@/lib/actions/items";
import { Button } from "@/components/ui/Button";
import type { Item } from "@/lib/types/domain";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function ListingActions({
  item,
  claimCount,
  t,
}: {
  item: Item;
  claimCount: number;
  t: Dictionary;
}) {
  const canDelete = claimCount === 0 && item.status !== "returned";
  const canClose = item.status === "open";
  const canMarkReturned =
    (item.type === "lost" && item.status === "open") ||
    (item.type === "found" && item.status === "claimed");

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/edit-listing/${item.id}`}>
        <Button variant="secondary">{t.listingActions.edit}</Button>
      </Link>

      {canMarkReturned && (
        <form action={markReturned}>
          <input type="hidden" name="itemId" value={item.id} />
          <Button type="submit" variant="primary">
            {t.listingActions.markReturned}
          </Button>
        </form>
      )}

      {canClose && (
        <form action={closeItem}>
          <input type="hidden" name="itemId" value={item.id} />
          <Button type="submit" variant="secondary">
            {t.listingActions.closeListing}
          </Button>
        </form>
      )}

      {canDelete ? (
        <form action={deleteItem}>
          <input type="hidden" name="itemId" value={item.id} />
          <Button type="submit" variant="danger">
            {t.listingActions.delete}
          </Button>
        </form>
      ) : (
        claimCount > 0 &&
        item.status !== "closed" && (
          <span className="self-center text-xs text-slate-500">
            {t.listingActions.hasClaimsHint}
          </span>
        )
      )}
    </div>
  );
}
