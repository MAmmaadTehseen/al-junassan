import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Chainable mock that returns itself for any method call
function createMockQueryBuilder(): any {
  const result = { data: [], error: null, count: 0 };
  const builder: any = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") return undefined; // Not a promise
        if (prop === "data") return result.data;
        if (prop === "error") return result.error;
        if (prop === "count") return result.count;
        return (..._args: any[]) => builder;
      },
    }
  );
  return builder;
}

function createMockClient(): any {
  return {
    from: () => ({
      select: () => createMockQueryBuilder(),
      insert: () => createMockQueryBuilder(),
      update: () => createMockQueryBuilder(),
      delete: () => createMockQueryBuilder(),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      exchangeCodeForSession: async () => ({ data: null, error: null }),
    },
  };
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith("http")) {
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
