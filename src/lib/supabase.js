import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/*
 * When the env vars are missing the app falls back to the local demo store,
 * so the storefront is fully browsable before any backend is wired up.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const backend = supabase ? 'supabase' : 'local'
