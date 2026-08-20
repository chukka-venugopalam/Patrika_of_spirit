// NOTE: Next.js 16 deprecates this file convention in favor of proxy.ts
// (export `proxy` instead of `middleware`). This project runs Next.js 14,
// so middleware.ts is correct — revisit this if the project is upgraded.
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
