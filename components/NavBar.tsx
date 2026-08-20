'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'

export default function NavBar() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link href="/" className="text-lg font-semibold text-gray-900">
        AwareNet
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {loading ? null : user ? (
          <>
            <Link href="/posts" className="text-gray-700 hover:text-gray-900">
              Posts
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
