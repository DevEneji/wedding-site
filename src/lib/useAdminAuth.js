import { useState, useEffect } from 'react'
import { supabase } from './supabase'

/**
 * Wraps Supabase email+password auth.
 * Only the admin account (set up in Supabase dashboard) can sign in.
 */
export function useAdminAuth() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Restore existing session on page load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    // Keep in sync with Supabase auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { session, checking, signIn, signOut, isAdmin: !!session }
}
