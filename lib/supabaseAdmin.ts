import { createClient } from '@supabase/supabase-js'

// Server only (route handlers). Uses the service role key, which must never reach the browser.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase admin env vars are missing')
  return createClient(url, key, { auth: { persistSession: false } })
}
