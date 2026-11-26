import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const ADMIN_COOKIE = 'sporkit_admin'
export const SESSION_DAYS = 7

type Env = { username: string; password: string; totp: string; secret: string }

export function readAdminEnv(): Env | null {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  const totp = process.env.ADMIN_TOTP_SECRET
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!username || !password || !totp || !secret || secret.length < 32) return null
  return { username, password, totp, secret }
}

export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

// Changing the password or the authenticator secret signs every existing session out.
function fingerprint(env: Env): string {
  return createHash('sha256').update(`${env.password}|${env.totp}`).digest('hex').slice(0, 16)
}

function sign(payload: string, env: Env): string {
  return createHmac('sha256', env.secret).update(payload).digest('base64url')
}

export function createSessionToken(env: Env, now = Date.now()): { token: string; expires: Date } {
  const expires = new Date(now + SESSION_DAYS * 24 * 3600 * 1000)
  const payload = Buffer.from(JSON.stringify({ exp: expires.getTime(), fp: fingerprint(env) })).toString('base64url')
  return { token: `${payload}.${sign(payload, env)}`, expires }
}

export function verifySessionToken(token: string | undefined, env: Env, now = Date.now()): boolean {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  if (!safeEqual(sig, sign(payload, env))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof data.exp === 'number' && data.exp > now && data.fp === fingerprint(env)
  } catch {
    return false
  }
}

// Every admin page and every admin action starts with this. The proxy only does a quick optimistic redirect.
export async function requireAdmin(): Promise<void> {
  const env = readAdminEnv()
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!env || !verifySessionToken(token, env)) redirect('/admin/login')
}
