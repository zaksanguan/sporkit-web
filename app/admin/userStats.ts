import { supabaseAdmin } from '../../lib/supabaseAdmin'

// Numbers for the Users tab, read live from our own tables (service role, server only). Bangkok days.
// Period choices for the Users tab: 7, 30 or 90 days, or all time (no previous period then).
export type Period = 7 | 30 | 90 | 'all'
export function parsePeriod(v: string | undefined): Period {
  return v === '30' ? 30 : v === '90' ? 90 : v === 'all' ? 'all' : 7
}
export type Windows = { today: number; period: number; prev: number | null }
export type UserStats = {
  period: Period
  people: Windows & { total: number; owners: number; pushIos: number; pushAndroid: number }
  posting: Windows & { posters: number; full: number; fullUsers: number }
  sporking: Windows & { reviews: number; full: number; fullUsers: number }
  viewing: Windows
  health: { claims: number; claimsOldestDays: number | null; reports: number; reportsOldestDays: number | null }
  error?: string
}

const DAY = 86400000
const bangkokDayStart = (now: number) => Math.floor((now + 7 * 3600 * 1000) / DAY) * DAY - 7 * 3600 * 1000

export async function loadUserStats(period: Period = 7): Promise<UserStats> {
  const db = supabaseAdmin()
  const now = Date.now()
  const t0 = bangkokDayStart(now)
  const w0 = period === 'all' ? 0 : now - period * DAY
  const p0 = period === 'all' ? null : now - 2 * period * DAY
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
  // Read every row in the window, 1000 at a time (the database caps one answer at 1000 rows).
  async function fetchAll(table: string, cols: string, build: (q: any) => any): Promise<{ data: any[] }> {
    const out: any[] = []
    for (let from = 0; from < 20000; from += 1000) {
      const { data, error } = await build(db.from(table).select(cols)).order('created_at', { ascending: true }).range(from, from + 999)
      if (error) throw new Error(`${table}: ${error.message}`)
      out.push(...(data ?? []))
      if ((data ?? []).length < 1000) break
    }
    return { data: out }
  }
  const windows = (table: string, build?: (q: any) => any) =>
    Promise.all([count(table, 'created_at', build, t0), count(table, 'created_at', build, w0), p0 === null ? Promise.resolve(null) : count(table, 'created_at', build, p0, w0)])
      .then(([today, per, prev]) => ({ today, period: per, prev }))

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
      fetchAll('videos', 'id, creator_id, description, dish_name, restaurant_id, cuisine_tags, protein_tags, meal_tags', (q) => q.eq('source', 'direct_upload').in('status', ['active', 'pending']).gte('created_at', iso(w0))),
      windows('sporks', activeSporks),
      fetchAll('sporks', 'user_id, video_id, dish_name, reasons, notes', (q) => q.eq('status', 'active').gte('created_at', iso(w0))),
      windows('video_views'),
      db.from('restaurants').select('updated_at', { count: 'exact' }).eq('claim_status', 'pending').order('updated_at', { ascending: true }).limit(1),
      db.from('reports').select('created_at', { count: 'exact' }).eq('status', 'pending').order('created_at', { ascending: true }).limit(1),
    ])
    const posters = new Set((posterRows.data ?? []).map((r: { creator_id: string | null }) => r.creator_id)).size
    // Flavor ratings for the videos in the window, read in small chunks (long id lists break the request address).
    type Flav = { user_id: string; video_id: string; source: string; sweet_salty: number | null; mild_spicy: number | null; bland_savory: number | null; mellow_sour: number | null; light_rich: number | null }
    async function flavorsFor(videoIds: string[]): Promise<Flav[]> {
      const out: Flav[] = []
      const ids = Array.from(new Set(videoIds))
      for (let i = 0; i < ids.length; i += 100) {
        const { data, error } = await db.from('flavor_ratings').select('user_id, video_id, source, sweet_salty, mild_spicy, bland_savory, mellow_sour, light_rich').in('video_id', ids.slice(i, i + 100))
        if (error) throw new Error(`flavor_ratings: ${error.message}`)
        out.push(...((data ?? []) as Flav[]))
      }
      return out
    }
    const pairs = (f: Flav) => [f.sweet_salty, f.mild_spicy, f.bland_savory, f.mellow_sour, f.light_rich].filter((x) => x !== null).length
    const filled = (t: string | null) => (t ?? '').trim().length > 0
    const has = (a: string[] | null) => (a?.length ?? 0) > 0

    type PostRow = { id: string; creator_id: string | null; description: string | null; dish_name: string | null; restaurant_id: string | null; cuisine_tags: string[] | null; protein_tags: string[] | null; meal_tags: string[] | null }
    const postRows = (posterRows.data ?? []) as PostRow[]
    const postFlav = await flavorsFor(postRows.map((r) => r.id))
    const postFlavOk = new Set(postFlav.filter((f) => f.source === 'post' && pairs(f) >= 1).map((f) => f.video_id))
    const fullPosts = postRows.filter((r) => filled(r.description) && filled(r.dish_name) && !!r.restaurant_id && has(r.cuisine_tags) && has(r.protein_tags) && has(r.meal_tags) && postFlavOk.has(r.id))
    const fullPostUsers = new Set(fullPosts.map((r) => r.creator_id)).size

    type SporkRow = { user_id: string; video_id: string | null; dish_name: string | null; reasons: string[] | null; notes: string | null }
    const sRows = (sporkRows.data ?? []) as SporkRow[]
    const withText = sRows.filter((r) => has(r.reasons) && filled(r.notes))
    const sFlav = await flavorsFor(withText.map((r) => r.video_id).filter((x): x is string => !!x))
    const allFive = new Set(sFlav.filter((f) => pairs(f) === 5).map((f) => `${f.user_id}:${f.video_id}`))
    const fullReviews = withText.filter((r) => !filled(r.dish_name) || (!!r.video_id && allFive.has(`${r.user_id}:${r.video_id}`)))
    const fullReviewUsers = new Set(fullReviews.map((r) => r.user_id)).size
    const reviews = (sporkRows.data ?? []).filter((r: { reasons: string[] | null; notes: string | null }) => (r.reasons?.length ?? 0) > 0 || (r.notes ?? '').trim().length > 0).length
    return {
      period,
      people: { ...people, total, owners, pushIos, pushAndroid },
      posting: { ...posting, posters, full: fullPosts.length, fullUsers: fullPostUsers },
      sporking: { ...sporking, reviews, full: fullReviews.length, fullUsers: fullReviewUsers },
      viewing,
      health: {
        claims: claims.count ?? 0,
        claimsOldestDays: oldestDays(claims.data?.[0]?.updated_at),
        reports: reports.count ?? 0,
        reportsOldestDays: oldestDays(reports.data?.[0]?.created_at),
      },
    }
  } catch (e) {
    const z = { today: 0, period: 0, prev: 0 }
    return {
      period,
      people: { ...z, total: 0, owners: 0, pushIos: 0, pushAndroid: 0 }, posting: { ...z, posters: 0, full: 0, fullUsers: 0 }, sporking: { ...z, reviews: 0, full: 0, fullUsers: 0 }, viewing: z,
      health: { claims: 0, claimsOldestDays: null, reports: 0, reportsOldestDays: null },
      error: e instanceof Error ? e.message : 'unknown',
    }
  }
}
