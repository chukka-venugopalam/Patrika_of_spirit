import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/posts')
  }

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">AwareNet</h1>
      <p className="mt-4 max-w-md text-gray-600">
        Most platforms count views and shares. AwareNet tracks how awareness actually
        propagates from person to person, so you can see how far the things you care
        about really travel.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/auth/login"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Log in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Sign up
        </Link>
      </div>
    </main>
  )
}
