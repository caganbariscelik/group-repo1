import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/server";
import { AuthStatusBar, LoginLink } from "@/components/auth/AuthStatusBar";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { lang, t } = await getDictionary();

  let name: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    name = profile?.name ?? null;
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Campus Lost &amp; Found
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/browse" className="text-sm text-slate-300 transition-colors hover:text-white">
            {t.nav.browse}
          </Link>
          {user && (
            <Link
              href="/my-listings"
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {t.nav.myListings}
            </Link>
          )}
          {user && (
            <Link
              href="/sent-claims"
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {t.nav.sentClaims}
            </Link>
          )}
          {user && name ? (
            <AuthStatusBar name={name} email={user.email ?? ""} logoutLabel={t.nav.logout} />
          ) : (
            <LoginLink label={t.nav.login} />
          )}
          <LanguageToggle lang={lang} />
        </nav>
      </div>
    </header>
  );
}
