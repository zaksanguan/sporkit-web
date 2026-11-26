'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { verifyTotp } from '../../lib/admin/totp'
import { ADMIN_COOKIE, createSessionToken, readAdminEnv, safeEqual } from '../../lib/admin/session'

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
