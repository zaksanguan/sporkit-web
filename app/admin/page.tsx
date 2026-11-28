import { requireAdmin } from '../../lib/admin/session'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import Shell from './Shell'
import { loadUserStats, parsePeriod } from './userStats'
import type { Snapshot } from './status'
import type { YoutubeItem } from './YoutubePage'

export const dynamic = 'force-dynamic'

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin()
  const { days } = await searchParams
  const stats = await loadUserStats(parsePeriod(days))
  const { data } = await supabaseAdmin()
    .from('admin_snapshots')
    .select('service,title,value,level,detail,checked_at')
    .order('title')
  // Broken YouTube videos (still live) and the ones hidden from this page; empty if the list cannot be read.
  const yt = await supabaseAdmin().rpc('admin_youtube_list')
  return <Shell snapshots={(data ?? []) as Snapshot[]} stats={stats} youtube={(yt.error ? [] : yt.data ?? []) as YoutubeItem[]} />
}
