import Link from "next/link";
import Image from "next/image";
import type { Item } from "@/lib/types/domain";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Lang } from "@/lib/i18n/dictionary";
import { TypeBadge, StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";

export function ItemCard({ item, t, lang }: { item: Item; t: Dictionary; lang: Lang }) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative h-40 w-full">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute left-2 top-2">
          <TypeBadge type={item.type} t={t} />
        </div>
        {item.status !== "open" && (
          <div className="absolute right-2 top-2">
            <StatusBadge status={item.status} t={t} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 font-medium text-slate-900 group-hover:text-slate-700">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500">{t.categories[item.category]}</p>
        {item.location && (
          <p className="line-clamp-1 text-sm text-slate-500">{item.location}</p>
        )}
        <p className="mt-auto text-xs text-slate-400">
          {formatDate(item.item_date, lang === "tr" ? "tr-TR" : "en-US")}
        </p>
      </div>
    </Link>
  );
}
