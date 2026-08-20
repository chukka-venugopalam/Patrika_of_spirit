import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const SESSION_COOKIE_NAME = 'awarenet_session_id'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year — tune as needed

const sessionCookieOptions = (maxAge: number) => ({
  maxAge,
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
})

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params
  const supabase = createClient()

  // 1. Resolve which post this token belongs to
  const { data: shareLink, error: shareLinkError } = await supabase
    .from('share_links')
    .select('token, post_id, parent_token')
    .eq('token', token)
    .maybeSingle()

  if (shareLinkError || !shareLink) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const postId = shareLink.post_id as string

  // 2. Find the 'share' event created alongside this token — it becomes
  //    the parent of the view we're about to log.
  const { data: causingShareEvent } = await supabase
    .from('awareness_events')
    .select('id')
    .eq('share_token', token)
    .eq('event_type', 'share')
    .maybeSingle()

  // 3. Resolve actor identity: logged-in user if present, else anonymous
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const actorId = user?.id ?? null

  // 4. Resolve session_id: reuse existing cookie, or mint a new one
  const existingSessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const sessionId = existingSessionId ?? randomUUID()

  // 5. Record the view event
  const newEventId = randomUUID()

  const { error: viewEventError } = await supabase.from('awareness_events').insert({
    id: newEventId,
    post_id: postId,
    actor_id: actorId,
    event_type: 'view',
    share_token: token,
    session_id: sessionId,
    parent_event_id: causingShareEvent?.id ?? null,
  })

  // 6. Redirect to the post. If the write failed, still let the person
  //    through — just omit viaEvent since there's no event id to attach a
  //    future reshare to.
  const redirectUrl = new URL(`/posts/${postId}`, request.url)
  redirectUrl.searchParams.set('viaToken', token)
  if (!viewEventError) {
    redirectUrl.searchParams.set('viaEvent', newEventId)
  }

  const response = NextResponse.redirect(redirectUrl)

  if (!existingSessionId) {
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions(SESSION_COOKIE_MAX_AGE))
  }

  return response
}
