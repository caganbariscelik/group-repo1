"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORY_OPTIONS } from "@/lib/types/domain";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/dictionary";

const fieldClasses =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-shadow focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

export function BrowseControls({
  initialQuery,
  initialLocation,
  initialType,
  initialCategory,
  initialSort,
  t,
}: {
  initialQuery: string;
  initialLocation: string;
  initialType: string;
  initialCategory: string;
  initialSort: string;
  t: Dictionary;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q, location });
  }

  const typeOptions = [
    { value: "all", label: t.browse.filterAll },
    { value: "lost", label: t.itemType.lost },
    { value: "found", label: t.itemType.found },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white p-4 shadow-xl sm:p-5">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          aria-label={t.browse.searchPlaceholder}
          placeholder={t.browse.searchPlaceholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${fieldClasses} sm:flex-1`}
        />
        <input
          type="text"
          aria-label={t.browse.locationPlaceholder}
          placeholder={t.browse.locationPlaceholder}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`${fieldClasses} sm:w-56`}
        />
        <Button type="submit">{t.browse.searchBtn}</Button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateParams({ type: opt.value })}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                (initialType || "all") === opt.value
                  ? "bg-lime-300 text-slate-950"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          aria-label={t.itemForm.categoryLabel}
          value={initialCategory || "all"}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="all">{t.browse.categoryAll}</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {t.categories[cat]}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort"
          value={initialSort || "newest"}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="newest">{t.browse.sortNewest}</option>
          <option value="oldest">{t.browse.sortOldest}</option>
        </select>
      </div>
    </div>
  );
}
