import Link from 'next/link'
import EmptyState from '@/components/EmptyState'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <EmptyState
        icon={
          <span aria-hidden="true" className="text-6xl font-bold tracking-tight text-amber-500">
            404
          </span>
        }
        heading="This page doesn't exist"
        subtext="The link might be broken, or the page may have moved."
      />
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
      >
        ← Back to home
      </Link>
    </main>
  )
}
