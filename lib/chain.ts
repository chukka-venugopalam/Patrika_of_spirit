import { createClient } from '@/lib/supabase/server'

export interface ChainStats {
  totalViews: number
  totalShares: number
  uniqueRecipients: number
  maxDepth: number
}

interface AwarenessEventRow {
  id: string
  event_type: 'view' | 'share'
  parent_event_id: string | null
  actor_id: string | null
  session_id: string | null
}

const PAGE_SIZE = 1000

/**
 * Fetches every awareness_events row for a post, paging past Supabase's
 * default 1000-row cap. Without this, a viral post's stats would silently
 * under-report once its event count crosses 1000.
 */
async function fetchAllEventsForPost(
  supabase: ReturnType<typeof createClient>,
  postId: string
): Promise<AwarenessEventRow[]> {
  const rows: AwarenessEventRow[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('awareness_events')
      .select('id, event_type, parent_event_id, actor_id, session_id')
      .eq('post_id', postId)
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      throw new Error(`Failed to fetch awareness_events for post ${postId}: ${error.message}`)
    }

    const page = (data ?? []) as AwarenessEventRow[]
    rows.push(...page)

    if (page.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return rows
}

/**
 * Computes aggregate chain statistics for a single post's awareness graph.
 *
 * DEPTH-CALCULATION APPROACH
 * ---------------------------
 * awareness_events form a FOREST, not one tree: any event whose
 * parent_event_id is null is a root — a direct/organic view, or a share
 * made with no tracked "causing" view. From each root, events fan out via
 * parent_event_id as views turn into shares turn into more views.
 *
 * We compute maxDepth with an iterative multi-source BFS (level-order
 * traversal), not recursion:
 *   1. Fetch every event for the post (paged, see above).
 *   2. Build a `childrenOf` map: parent id -> [child ids]. Any event whose
 *      parent_event_id is null, OR isn't one of this post's own event ids,
 *      is treated as a root.
 *   3. BFS outward from ALL roots at once, depth 0 at the roots,
 *      incrementing by 1 per hop. maxDepth = the deepest level reached.
 *   4. A `visited` set means each node is processed exactly once — O(n)
 *      total, immune to infinite loops on malformed/cyclic data.
 *
 * CONVENTION: depth is edges, not nodes. A single isolated view (root, no
 * children) has depth 0. A view -> share -> view chain has depth 2.
 *
 * uniqueRecipients: counted from 'view' events only, keyed by actor_id
 * when logged in, else session_id.
 */
export async function getChainStats(postId: string): Promise<ChainStats> {
  const supabase = createClient()
  const rows = await fetchAllEventsForPost(supabase, postId)

  if (rows.length === 0) {
    return { totalViews: 0, totalShares: 0, uniqueRecipients: 0, maxDepth: 0 }
  }

  let totalViews = 0
  let totalShares = 0
  const recipientKeys = new Set<string>()

  const idSet = new Set(rows.map((r) => r.id))
  const childrenOf = new Map<string, string[]>()
  const roots: string[] = []

  for (const row of rows) {
    if (row.event_type === 'view') {
      totalViews++
      const key = row.actor_id ?? row.session_id
      if (key) recipientKeys.add(key)
    } else {
      totalShares++
    }

    const parentId = row.parent_event_id
    if (parentId !== null && idSet.has(parentId)) {
      const siblings = childrenOf.get(parentId) ?? []
      siblings.push(row.id)
      childrenOf.set(parentId, siblings)
    } else {
      roots.push(row.id)
    }
  }

  let maxDepth = 0
  const visited = new Set<string>(roots)
  let frontier = roots
  let depth = 0

  while (frontier.length > 0) {
    const nextFrontier: string[] = []
    for (const nodeId of frontier) {
      const children = childrenOf.get(nodeId) ?? []
      for (const childId of children) {
        if (visited.has(childId)) continue
        visited.add(childId)
        nextFrontier.push(childId)
      }
    }
    if (nextFrontier.length > 0) {
      depth++
      maxDepth = depth
    }
    frontier = nextFrontier
  }

  return {
    totalViews,
    totalShares,
    uniqueRecipients: recipientKeys.size,
    maxDepth,
  }
}
