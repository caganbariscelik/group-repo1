import { createClient } from "@/lib/supabase/server";
import type { Item, ItemCategory, ItemType } from "@/lib/types";
import { sanitizeSearchTerm } from "@/lib/format";
import BrowseControls from "@/components/BrowseControls";
import ItemCard from "@/components/ItemCard";
import { NeonMesh } from "@/components/ui/neon-mesh";

export const dynamic = "force-dynamic";

interface BrowseSearchParams {
  q?: string;
  type?: string;
  category?: string;
  location?: string;
  sort?: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: BrowseSearchParams;
}) {
  const supabase = createClient();

  const q = sanitizeSearchTerm(searchParams.q || "");
  const type = searchParams.type || "all";
  const category = searchParams.category || "all";
  const location = sanitizeSearchTerm(searchParams.location || "");
  const sort = searchParams.sort === "oldest" ? "oldest" : "newest";

  let query = supabase
    .from("items")
    .select("*")
    .in("status", ["open", "claimed"]);

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (type === "lost" || type === "found") {
    query = query.eq("type", type satisfies ItemType);
  }
  if (category !== "all") {
    query = query.eq("category", category as ItemCategory);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  query = query.order("created_at", { ascending: sort === "oldest" });

  const { data: items, error } = await query;

  return (
    <>
      <NeonMesh variant="backdrop" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Browse Lost &amp; Found Items</h1>
          <p className="text-sm text-gray-400">
            Search open listings, or filter by type, category, and location.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-xl shadow-black/40 sm:p-5">
          <BrowseControls
            initialQuery={searchParams.q || ""}
            initialLocation={searchParams.location || ""}
            initialType={type}
            initialCategory={category}
            initialSort={sort}
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            Couldn&apos;t load items: {error.message}
          </p>
        )}

        {!error && items && items.length === 0 && (
          <p className="rounded-md border border-dashed border-gray-600 bg-white/5 p-8 text-center text-sm text-gray-300">
            No items match your search.
          </p>
        )}

        {!error && items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(items as Item[]).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
