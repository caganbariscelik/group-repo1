import { createClient } from "@/lib/supabase/server";
import type { Item, Category, ItemType } from "@/lib/types/domain";
import { CATEGORY_OPTIONS } from "@/lib/types/domain";
import { sanitizeSearchTerm } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { BrowseControls } from "@/components/browse/BrowseControls";
import { ItemCard } from "@/components/browse/ItemCard";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    location?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const { t, lang } = await getDictionary();
  const supabase = await createClient();

  const q = sanitizeSearchTerm(params.q || "");
  const type = params.type || "all";
  const category = params.category || "all";
  const location = sanitizeSearchTerm(params.location || "");
  const sort = params.sort === "oldest" ? "oldest" : "newest";

  let query = supabase.from("items").select("*").in("status", ["open", "claimed"]);

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (type === "lost" || type === "found") {
    query = query.eq("type", type satisfies ItemType);
  }
  if (category !== "all" && (CATEGORY_OPTIONS as readonly string[]).includes(category)) {
    query = query.eq("category", category as Category);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  query = query.order("created_at", { ascending: sort === "oldest" });

  const { data: items, error } = await query;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-white">{t.browse.title}</h1>
        <p className="text-sm text-slate-300">{t.browse.description}</p>
      </div>

      <BrowseControls
        initialQuery={params.q || ""}
        initialLocation={params.location || ""}
        initialType={type}
        initialCategory={category}
        initialSort={sort}
        t={t}
      />

      {error && (
        <p className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          {t.browse.loadErrorPrefix}
          {error.message}
        </p>
      )}

      {!error && items && items.length === 0 && (
        <p className="rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-slate-300">
          {t.browse.noResults}
        </p>
      )}

      {!error && items && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(items as Item[]).map((item) => (
            <ItemCard key={item.id} item={item} t={t} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
