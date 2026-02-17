import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith("http")) {
    // Return a mock client during build/SSR when Supabase is not configured
    return {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        signInWithOAuth: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        signOut: async () => {},
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
