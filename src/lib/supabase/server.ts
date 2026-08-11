// Shared file — coordinate with Student 2 before editing.
// Server-side Supabase client for server components, server actions, and
// route handlers. Reads/writes cookies via next/headers so every request
// carries the real user's session and RLS applies.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component without a mutable response
            // (e.g. during render) — safe to ignore because middleware
            // refreshes the session on every request anyway.
          }
        },
      },
    },
  );
}
