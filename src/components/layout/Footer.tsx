import { getDictionary } from "@/lib/i18n/server";

export async function Footer() {
  const { t } = await getDictionary();

  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-slate-400">
        {t.footer.tagline}
      </div>
    </footer>
  );
}
