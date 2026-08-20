'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseUserResult {
  user: { id: string; email: string } | null
  loading: boolean
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? { id: user.id, email: user.email ?? '' } : null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? '' } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
