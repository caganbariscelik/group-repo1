"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/browse");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-white/15 px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:border-white/30 hover:text-white"
    >
      Log out
    </button>
  );
}
