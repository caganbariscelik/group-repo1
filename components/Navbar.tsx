import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/browse" className="text-lg font-semibold text-gray-900">
          Campus Lost &amp; Found
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-600 sm:gap-6">
          <Link href="/browse" className="hover:text-gray-900">
            Browse Items
          </Link>
          <Link href="/sent-claims" className="hover:text-gray-900">
            Sent Claims
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-gray-500 sm:inline">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
