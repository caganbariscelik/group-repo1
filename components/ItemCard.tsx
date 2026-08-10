import Link from "next/link";
import type { Item } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { ItemTypeBadge, ItemStatusBadge } from "./StatusBadge";
import ItemImage from "./ItemImage";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md"
    >
      <div className="relative h-40 w-full">
        <ItemImage src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />
        <div className="absolute left-2 top-2">
          <ItemTypeBadge type={item.type} />
        </div>
        {item.status !== "open" && (
          <div className="absolute right-2 top-2">
            <ItemStatusBadge status={item.status} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 font-medium text-gray-900 group-hover:text-brand-700">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        {item.location && (
          <p className="line-clamp-1 text-sm text-gray-500">📍 {item.location}</p>
        )}
        <p className="mt-auto text-xs text-gray-400">{formatDate(item.item_date)}</p>
      </div>
    </Link>
  );
}
