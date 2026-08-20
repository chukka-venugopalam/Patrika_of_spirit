import EmptyState from '@/components/EmptyState'

export interface PostReachStats {
  postId: string
  title: string
  totalViews: number
  totalShares: number
  uniqueRecipients: number
  maxDepth: number
}

interface ChainDepthListProps {
  posts: PostReachStats[]
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function ChainDepthList({ posts }: ChainDepthListProps) {
  if (posts.length === 0) {
    return (
      <section
        aria-label="Post breakdown"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <EmptyState
          icon={
            <svg
              className="h-10 w-10 text-slate-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          }
          heading="No posts yet"
          subtext="You haven't viewed or shared any posts yet — your breakdown will show up here."
        />
      </section>
    )
  }

  const sorted = [...posts].sort((a, b) => b.uniqueRecipients - a.uniqueRecipients)

  return (
    <section
      aria-label="Post breakdown"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          Per-post breakdown
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Full chain totals for each post you&apos;ve viewed or shared.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-medium text-slate-500">
                Post
              </th>
              <th scope="col" className="px-6 py-3 text-right font-medium text-slate-500">
                People reached
              </th>
              <th scope="col" className="px-6 py-3 text-right font-medium text-slate-500">
                Shares
              </th>
              <th scope="col" className="px-6 py-3 text-right font-medium text-slate-500">
                Views
              </th>
              <th scope="col" className="px-6 py-3 text-right font-medium text-slate-500">
                Chain depth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((post) => (
              <tr key={post.postId} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                <td className="px-6 py-4 text-right tabular-nums text-slate-700">
                  {formatCount(post.uniqueRecipients)}
                </td>
                <td className="px-6 py-4 text-right tabular-nums text-slate-700">
                  {formatCount(post.totalShares)}
                </td>
                <td className="px-6 py-4 text-right tabular-nums text-slate-700">
                  {formatCount(post.totalViews)}
                </td>
                <td className="px-6 py-4 text-right tabular-nums text-slate-700">
                  {post.maxDepth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
