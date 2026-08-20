export default function PostsLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div role="status" aria-label="Loading posts" className="animate-pulse space-y-6">
        <span className="sr-only">Loading…</span>

        <div>
          <div className="h-7 w-32 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
        </div>

        <ul className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-3/5 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-4/5 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/5 rounded bg-slate-100" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
