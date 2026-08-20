'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import ShareButton from '@/components/ShareButton'

interface ShareSectionProps {
  postId: string
}

interface ShareResponse {
  token: string
  url: string
}

export default function ShareSection({ postId }: ShareSectionProps) {
  const { user, loading } = useUser()
  const searchParams = useSearchParams()
  const causingEventId = searchParams.get('viaEvent') ?? undefined

  async function createShareLink(id: string): Promise<ShareResponse> {
    if (!user) {
      // Guard only — logged-out users never see <ShareButton />, so this
      // path shouldn't be reachable in practice.
      throw new Error('You must be logged in to share this post.')
    }

    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: id,
        actorId: user.id,
        ...(causingEventId ? { causingEventId } : {}),
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to create share link.')
    }

    const data: ShareResponse = await res.json()

    // /api/share returns a relative path (e.g. "/share/{token}"). Normalize
    // to an absolute URL so the copied link is usable outside the site.
    const absoluteUrl = data.url.startsWith('/')
      ? `${window.location.origin}${data.url}`
      : data.url

    return { token: data.token, url: absoluteUrl }
  }

  if (loading) {
    return <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-100" />
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <Link href="/auth/login" className="font-medium text-gray-900 underline">
          Log in
        </Link>{' '}
        to share this post.
      </div>
    )
  }

  return <ShareButton postId={postId} onShare={createShareLink} />
}
