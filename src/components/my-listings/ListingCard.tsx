import Image from "next/image";
import type { Item } from "@/lib/types/domain";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { StatusBadge, TypeBadge } from "@/components/ui/Badge";

export function ListingCard({
  item,
  t,
  children,
}: {
  item: Item;
  t: Dictionary;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
      <Image
        src={item.image_url}
        alt={item.title}
        width={160}
        height={160}
        unoptimized
        className="h-40 w-full rounded-md object-cover sm:h-32 sm:w-32"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} t={t} />
          <StatusBadge status={item.status} t={t} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-slate-600 sm:grid-cols-3">
          <div>
            <dt className="inline font-medium text-slate-800">{t.listingCard.category} </dt>
            <dd className="inline">{t.categories[item.category]}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-800">{t.listingCard.location} </dt>
            <dd className="inline">{item.location}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-800">{t.listingCard.date} </dt>
            <dd className="inline">{item.item_date}</dd>
          </div>
        </dl>
        {children}
      </div>
    </div>
  );
}
