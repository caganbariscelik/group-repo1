import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/browse" className="text-lg font-semibold text-white">
          Campus Lost &amp; Found
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-300 sm:gap-6">
          <Link href="/browse" className="transition hover:text-brand-400">
            Browse Items
          </Link>
          <Link href="/sent-claims" className="transition hover:text-brand-400">
            Sent Claims
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-gray-400 sm:inline">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-gray-900 transition hover:bg-brand-400"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
