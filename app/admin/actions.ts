'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { verifyTotp } from '../../lib/admin/totp'
import { ADMIN_COOKIE, createSessionToken, readAdminEnv, requireAdmin, safeEqual } from '../../lib/admin/session'

const MAX_FAILS = 8            // wrong tries in the window below, counted for the whole page (one admin)
const WINDOW_MIN = 15
export type LoginState = { error?: string }

const text = (v: FormDataEntryValue | null, max: number) => (typeof v === 'string' ? v.slice(0, max) : '')

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const env = readAdminEnv()
  if (!env) return { error: 'Admin login is not set up yet.' }

  const username = text(formData.get('username'), 100).trim()
  const password = text(formData.get('password'), 200)
  const code = text(formData.get('code'), 20).replace(/\s+/g, '')

  const db = supabaseAdmin()
  const since = new Date(Date.now() - WINDOW_MIN * 60 * 1000).toISOString()
  const { count, error } = await db
    .from('admin_login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ok', false)
    .gte('created_at', since)
  // If we cannot count the tries we do not let anyone in.
  if (error) return { error: 'Login is not available right now. Try again in a minute.' }
  if ((count ?? 0) >= MAX_FAILS) return { error: `Too many wrong tries. Try again in ${WINDOW_MIN} minutes.` }

  // Check all three every time so the answer never shows which one was wrong.
  const userOk = safeEqual(username, env.username)
  const passOk = safeEqual(password, env.password)
  let step: number | null = null
  try {
    step = verifyTotp(code, env.totp)
  } catch {
    return { error: 'Admin login is not set up correctly.' }
  }
  let replay = false
  if (step !== null) {
    const { count: used } = await db
      .from('admin_login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('ok', true)
      .eq('totp_step', step)
    replay = (used ?? 0) > 0 // a code works once
  }
  const ok = userOk && passOk && step !== null && !replay

  await db.from('admin_login_attempts').insert({ ok, totp_step: ok ? step : null })
  // Keep the table small.
  await db.from('admin_login_attempts').delete().lt('created_at', new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())

  if (!ok) return { error: 'Wrong details. Check the username, password and code.' }

  const { token, expires } = createSessionToken(env)
  ;(await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    expires,
  })
  redirect('/admin')
}

export async function logout(): Promise<void> {
  ;(await cookies()).delete({ name: ADMIN_COOKIE, path: '/admin' })
  redirect('/admin/login')
}

// Refresh button: ask the checker to run once now. The page then re-reads the saved numbers.
// Needs ADMIN_CHECK_SECRET in Vercel (same value as the Supabase function secret). Without it the button only re-reads.
const CHECK_PATH = '/functions/v1/dynamic-worker' // the checker's live address (display name admin-check)
export async function refreshNow(): Promise<{ ran: boolean }> {
  await requireAdmin()
  const secret = process.env.ADMIN_CHECK_SECRET
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!secret || !base) return { ran: false }
  try {
    const res = await fetch(`${base}${CHECK_PATH}?mode=check`, {
      method: 'POST',
      headers: { 'x-webhook-secret': secret },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    })
    return { ran: res.ok }
  } catch {
    return { ran: false }
  }
}

// Hide / Unhide a broken YouTube video (admin step 7). Only changes the video's status; sporks, Bites and notifications stay.
// Server-side function supabase/sql/youtube_health.sql (service role only). Results: hidden | unhidden | not_found | not_active |
// already_hidden | not_hidden_by_admin | error.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export async function setYoutubeHidden(videoId: string, hide: boolean): Promise<{ result: string }> {
  await requireAdmin()
  if (typeof videoId !== 'string' || !UUID.test(videoId)) return { result: 'not_found' }
  const { data, error } = await supabaseAdmin().rpc('admin_set_youtube_hidden', { p_video_id: videoId, p_hide: !!hide })
  if (error || typeof data !== 'string') return { result: 'error' }
  return { result: data }
}
