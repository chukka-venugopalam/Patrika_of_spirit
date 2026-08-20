import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Synchronous: Next.js 14's cookies() returns the store directly, not a
// Promise. Every caller in this project treats createClient() as sync —
// don't `await` it. (If this project is ever upgraded to Next.js 15+,
// cookies() becomes async and this function needs `async`/`await` added.)
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore since
            // middleware.ts refreshes the session on every request.
          }
        },
      },
    }
  )
}
