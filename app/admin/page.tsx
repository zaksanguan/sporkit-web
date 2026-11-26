import { requireAdmin } from '../../lib/admin/session'
import Shell from './Shell'

export default async function AdminPage() {
  await requireAdmin()
  return <Shell />
}
