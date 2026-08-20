// AwareNet — dashboard module. Server component only; reads user_reach,
// awareness_events, posts, and lib/chain.ts. No auth/chain logic lives here.
import { createClient } from '@/lib/supabase/server'
import { getChainStats } from '@/lib/chain'
import ReachSummaryCard from '@/components/ReachSummaryCard'
import ChainDepthList, { type PostReachStats } from '@/components/ChainDepthList'

// This is a personalized, auth-gated view — never let Next statically
// cache or prerender it.
export const dynamic = 'force-dynamic'

interface UserReachRow {
  actor_id: string
  total_views_generated: number | null
  total_shares_made: number | null
  posts_touched: number | null
}

interface PostRow {
  id: string
  title: string
}

async function getTouchedPostIds(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('awareness_events')
    .select('post_id')
    .eq('actor_id', userId)

  if (error) {
    console.error('[dashboard] failed to load touched posts', error)
    return []
  }

  // One row per event, so de-dupe post_ids in memory — PostgREST doesn't
  // expose a plain DISTINCT through the JS client without an RPC.
  const uniqueIds = new Set<string>()
  for (const row of data ?? []) {
    if (row.post_id) uniqueIds.add(row.post_id)
  }
  return Array.from(uniqueIds)
}

async function getPerPostBreakdown(
  supabase: ReturnType<typeof createClient>,
  postIds: string[]
): Promise<PostReachStats[]> {
  if (postIds.length === 0) return []

  const [{ data: posts, error: postsError }, chainStatsResults] = await Promise.all([
    supabase.from('posts').select('id, title').in('id', postIds),
    Promise.all(
      postIds.map(async (postId) => {
        try {
          const stats = await getChainStats(postId)
          return { postId, stats }
        } catch (err) {
          console.error(`[dashboard] getChainStats failed for post ${postId}`, err)
          return {
            postId,
            stats: { totalViews: 0, totalShares: 0, uniqueRecipients: 0, maxDepth: 0 },
          }
        }
      })
    ),
  ])

  if (postsError) {
    console.error('[dashboard] failed to load post titles', postsError)
  }

  const titleById = new Map<string, string>(
    ((posts ?? []) as PostRow[]).map((p) => [p.id, p.title])
  )

  return chainStatsResults.map(({ postId, stats }) => ({
    postId,
    title: titleById.get(postId) ?? 'Untitled post',
    totalViews: stats.totalViews,
    totalShares: stats.totalShares,
    uniqueRecipients: stats.uniqueRecipients,
    maxDepth: stats.maxDepth,
  }))
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">Sign in to see your reach dashboard.</p>
      </main>
    )
  }

  const { data: reachRowRaw, error: reachError } = await supabase
    .from('user_reach')
    .select('actor_id, total_views_generated, total_shares_made, posts_touched')
    .eq('actor_id', user.id)
    .maybeSingle()

  if (reachError) {
    console.error('[dashboard] failed to load user_reach row', reachError)
  }
  const reachRow = reachRowRaw as UserReachRow | null

  const postIds = await getTouchedPostIds(supabase, user.id)
  const perPostBreakdown = await getPerPostBreakdown(supabase, postIds)

  // "People reached" comes from user_reach.total_views_generated — the
  // actor-scoped rollup — rather than summing uniqueRecipients across
  // perPostBreakdown, which returns whole-chain numbers (every
  // contributor), not just this user's slice.
  const peopleReached = reachRow?.total_views_generated ?? 0
  const totalShares = reachRow?.total_shares_made ?? 0
  const deepestChain = perPostBreakdown.reduce(
    (max, post) => Math.max(max, post.maxDepth),
    0
  )

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Your reach
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        How far the posts you&apos;ve viewed and shared have traveled.
      </p>

      <div className="mt-6">
        <ReachSummaryCard
          peopleReached={peopleReached}
          totalShares={totalShares}
          maxDepth={deepestChain}
        />
      </div>

      <div className="mt-8">
        <ChainDepthList posts={perPostBreakdown} />
      </div>
    </main>
  )
}
