'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

export default function ProfileSettings() {
  const supabase = createClient()
  const { user, loading: userLoading } = useUser()

  const [displayName, setDisplayName] = useState('')
  const [allowPublicAttribution, setAllowPublicAttribution] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function loadProfile() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, allow_public_attribution')
        .eq('id', user!.id)
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        setDisplayName(data.display_name ?? '')
        setAllowPublicAttribution(Boolean(data.allow_public_attribution))
      }

      setLoading(false)
    }

    loadProfile()
  }, [user, supabase])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setError(null)
    setSaved(false)

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        allow_public_attribution: allowPublicAttribution,
      })
      .eq('id', user.id)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setSaved(true)
  }

  if (userLoading || loading) {
    return <p className="text-sm text-gray-500">Loading profile…</p>
  }

  if (!user) {
    return <p className="text-sm text-gray-500">You need to be logged in to edit your profile.</p>
  }

  return (
    <form onSubmit={handleSave} className="max-w-md space-y-4">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display name</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="allowPublicAttribution"
          type="checkbox"
          checked={allowPublicAttribution}
          onChange={(e) => setAllowPublicAttribution(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="allowPublicAttribution" className="text-sm text-gray-700">Allow public attribution</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
