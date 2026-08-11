// TODO(Student 2): replace with the real Browse Items page (search, filters,
// claim submission). This is a throwaway placeholder — feel free to
// overwrite this whole file.

import { getDictionary } from "@/lib/i18n/server";

export default async function BrowsePage() {
  const { t } = await getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-300">
      <h1 className="text-2xl font-semibold text-white">{t.browse.title}</h1>
      <p className="mt-2">{t.browse.comingSoon}</p>
    </div>
  );
}
