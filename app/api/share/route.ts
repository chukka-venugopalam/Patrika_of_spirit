import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface CreateShareBody {
  postId: string
  actorId: string
  parentToken?: string
  causingEventId?: string
}

const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  let body: CreateShareBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId, actorId, parentToken, causingEventId } = body

  if (!postId || !actorId) {
    return NextResponse.json({ error: 'postId and actorId are required' }, { status: 400 })
  }

  const supabase = createClient()

  // Auth check: don't trust actorId from the body — confirm it matches the
  // actual signed-in session before doing anything else.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  if (user.id !== actorId) {
    return NextResponse.json(
      { error: 'actorId does not match the authenticated user' },
      { status: 403 }
    )
  }

  // Rate limit: block if this actor already has MORE THAN 20 share_links in
  // the trailing hour (checked before this new one is added).
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()

  const { count, error: rateLimitError } = await supabase
    .from('share_links')
    .select('*', { count: 'exact', head: true })
    .eq('actor_id', actorId)
    .gte('created_at', windowStart)

  if (rateLimitError) {
    return NextResponse.json(
      { error: 'Failed to check rate limit', details: rateLimitError.message },
      { status: 500 }
    )
  }

  if ((count ?? 0) > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Rate limit exceeded: no more than 20 shares per hour' },
      { status: 429 }
    )
  }

  // Single atomic call: the create_share() Postgres function handles
  // causing-event validation, both inserts, and rollback-on-failure
  // internally (see supabase/migrations/0002_create_share_rpc.sql).
  const { data, error: rpcError } = await supabase
    .rpc('create_share', {
      p_post_id: postId,
      p_actor_id: actorId,
      p_parent_token: parentToken ?? null,
      p_causing_event_id: causingEventId ?? null,
    })
    .single()

  if (rpcError) {
    const status = rpcError.message?.includes('invalid_causing_event') ? 400 : 500
    return NextResponse.json(
      { error: 'Failed to create share', details: rpcError.message },
      { status }
    )
  }

  const result = data as { token: string; event_id: string }

  return NextResponse.json({
    token: result.token,
    url: `/share/${result.token}`,
  })
}
