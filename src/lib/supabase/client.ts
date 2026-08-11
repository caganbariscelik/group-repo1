// Shared file — coordinate with Student 2 before editing.
// Browser-side Supabase client. Use only in client components (e.g.
// signInWithOtp, signOut). All data reads/writes should go through
// lib/supabase/server.ts server actions instead, so RLS is always
// evaluated against the real session cookie.

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
