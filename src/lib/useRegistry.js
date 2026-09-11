import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

/**
 * Fetches registry items from Supabase and provides
 * add / remove helpers for the admin panel.
 */
export function useRegistry() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('registry_items')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function addItem(item) {
    const { error } = await supabase
      .from('registry_items')
      .insert([item])
    if (error) return { ok: false, error: error.message }
    await fetch()
    return { ok: true }
  }

  async function removeItem(id) {
    const { error } = await supabase
      .from('registry_items')
      .delete()
      .eq('id', id)
    if (error) return { ok: false, error: error.message }
    await fetch()
    return { ok: true }
  }

  return { items, loading, error, refetch: fetch, addItem, removeItem }
}
