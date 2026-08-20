'use client'

import { useState } from 'react'

interface ShareButtonProps {
  postId: string
  onShare: (postId: string) => Promise<{ token: string; url: string }>
}

export default function ShareButton({ postId, onShare }: ShareButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ token: string; url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    setLoading(true)
    setError(null)
    try {
      const res = await onShare(postId)
      setResult(res)
    } catch {
      setError('Could not create a share link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy the link. Please copy it manually.')
    }
  }

  return (
    <div>
      {!result ? (
        <button
          onClick={handleShare}
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating link…' : 'Share this post'}
        </button>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            readOnly
            value={result.url}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 sm:flex-1"
          />
          <button
            onClick={handleCopy}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
