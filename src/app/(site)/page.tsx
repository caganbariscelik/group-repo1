import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/server";

export default async function LandingPage() {
  const { t } = await getDictionary();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm">
        {t.landing.badge}
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {t.landing.title}
      </h1>
      <p className="max-w-xl text-lg text-slate-300">{t.landing.description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href="/browse">
          <Button variant="secondary">{t.landing.browseBtn}</Button>
        </Link>
        <Link href="/report">
          <Button>{t.landing.reportBtn}</Button>
        </Link>
      </div>
    </div>
  );
}
