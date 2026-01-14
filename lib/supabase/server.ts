import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

/**
 * Supabase client for server-side operations
 * Uses the modern @supabase/ssr package with proper cookie handling
 * ONLY use this in server components, API routes, or server actions
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client for service role operations
 * This client has full admin access and bypasses RLS
 * Use only for trusted operations like generateStaticParams
 * DO NOT expose in API routes accessible to users
 */
export function createServiceRoleClient() {
  const { createClient } = require("@supabase/supabase-js");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Return a dummy client if env vars are not set (for build time)
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase service role credentials not configured. Using dummy client.");
    return {
      from: () => ({
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      })
    };
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
