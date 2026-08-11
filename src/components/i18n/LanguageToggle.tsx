"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANG_COOKIE, type Lang } from "@/lib/i18n/dictionary";

function setLangCookie(next: Lang) {
  document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000`;
}

export function LanguageToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Lang) {
    if (next === lang) return;
    setLangCookie(next);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-medium">
      {(["tr", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          disabled={pending}
          onClick={() => switchTo(option)}
          aria-pressed={lang === option}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === option
              ? "bg-white text-slate-900"
              : "text-slate-300 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
