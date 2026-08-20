export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div
        role="status"
        aria-label="Loading your reach dashboard"
        className="animate-pulse space-y-8"
      >
        <span className="sr-only">Loading…</span>

        <div>
          <div className="h-7 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 rounded bg-slate-100" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 rounded bg-slate-100" />
                <div className="mt-2 h-8 w-16 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="flex gap-8">
                  <div className="h-4 w-10 rounded bg-slate-100" />
                  <div className="h-4 w-10 rounded bg-slate-100" />
                  <div className="h-4 w-10 rounded bg-slate-100" />
                  <div className="h-4 w-10 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
