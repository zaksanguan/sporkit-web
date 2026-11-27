import { supabaseAdmin } from '../../lib/supabaseAdmin'

// Numbers for the Users tab, read live from our own tables (service role, server only). Bangkok days.
export type Windows = { today: number; week: number; prevWeek: number }
export type UserStats = {
  people: Windows & { total: number; owners: number; pushIos: number; pushAndroid: number }
  posting: Windows & { posters: number }
  sporking: Windows & { reviews: number }
  viewing: Windows
  health: { claims: number; claimsOldestDays: number | null; reports: number; reportsOldestDays: number | null }
  error?: string
}

const DAY = 86400000
const bangkokDayStart = (now: number) => Math.floor((now + 7 * 3600 * 1000) / DAY) * DAY - 7 * 3600 * 1000

export async function loadUserStats(): Promise<UserStats> {
  const db = supabaseAdmin()
  const now = Date.now()
  const t0 = bangkokDayStart(now)
  const w0 = now - 7 * DAY
  const p0 = now - 14 * DAY
  const iso = (ms: number) => new Date(ms).toISOString()

  async function count(table: string, col: string, build?: (q: any) => any, from?: number, to?: number): Promise<number> {
    let q: any = db.from(table).select('*', { count: 'exact', head: true })
    if (from !== undefined) q = q.gte(col, iso(from))
    if (to !== undefined) q = q.lt(col, iso(to))
    if (build) q = build(q)
    const { count: n, error } = await q
    if (error) throw new Error(`${table}: ${error.message}`)
    return n ?? 0
  }
  const windows = (table: string, build?: (q: any) => any) =>
    Promise.all([count(table, 'created_at', build, t0), count(table, 'created_at', build, w0), count(table, 'created_at', build, p0, w0)])
      .then(([today, week, prevWeek]) => ({ today, week, prevWeek }))

  const uploads = (q: any) => q.eq('source', 'direct_upload').in('status', ['active', 'pending'])
  const activeSporks = (q: any) => q.eq('status', 'active')
  const oldestDays = (iso0: string | undefined) => (iso0 ? Math.max(0, Math.floor((now - Date.parse(iso0)) / DAY)) : null)

  try {
    const [people, total, owners, pushIos, pushAndroid, posting, posterRows, sporking, sporkRows, viewing, claims, reports] = await Promise.all([
      windows('users'),
      count('users', 'created_at'),
      count('users', 'created_at', (q) => q.eq('role', 'restaurant_owner')),
      count('push_tokens', 'updated_at', (q) => q.eq('platform', 'ios')),
      count('push_tokens', 'updated_at', (q) => q.eq('platform', 'android')),
      windows('videos', uploads),
      db.from('videos').select('creator_id').eq('source', 'direct_upload').in('status', ['active', 'pending']).gte('created_at', iso(w0)).limit(5000),
      windows('sporks', activeSporks),
      db.from('sporks').select('reasons, notes').eq('status', 'active').gte('created_at', iso(w0)).limit(5000),
      windows('video_views'),
      db.from('restaurants').select('updated_at', { count: 'exact' }).eq('claim_status', 'pending').order('updated_at', { ascending: true }).limit(1),
      db.from('reports').select('created_at', { count: 'exact' }).eq('status', 'pending').order('created_at', { ascending: true }).limit(1),
    ])
    const posters = new Set((posterRows.data ?? []).map((r: { creator_id: string | null }) => r.creator_id)).size
    const reviews = (sporkRows.data ?? []).filter((r: { reasons: string[] | null; notes: string | null }) => (r.reasons?.length ?? 0) > 0 || (r.notes ?? '').trim().length > 0).length
    return {
      people: { ...people, total, owners, pushIos, pushAndroid },
      posting: { ...posting, posters },
      sporking: { ...sporking, reviews },
      viewing,
      health: {
        claims: claims.count ?? 0,
        claimsOldestDays: oldestDays(claims.data?.[0]?.updated_at),
        reports: reports.count ?? 0,
        reportsOldestDays: oldestDays(reports.data?.[0]?.created_at),
      },
    }
  } catch (e) {
    const z = { today: 0, week: 0, prevWeek: 0 }
    return {
      people: { ...z, total: 0, owners: 0, pushIos: 0, pushAndroid: 0 }, posting: { ...z, posters: 0 }, sporking: { ...z, reviews: 0 }, viewing: z,
      health: { claims: 0, claimsOldestDays: null, reports: 0, reportsOldestDays: null },
      error: e instanceof Error ? e.message : 'unknown',
    }
  }
}
