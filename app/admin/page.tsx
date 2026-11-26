import { requireAdmin } from '../../lib/admin/session'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import Shell from './Shell'
import type { Snapshot } from './status'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin()
  const { data } = await supabaseAdmin()
    .from('admin_snapshots')
    .select('service,title,value,level,checked_at')
    .order('title')
  return <Shell snapshots={(data ?? []) as Snapshot[]} />
}
