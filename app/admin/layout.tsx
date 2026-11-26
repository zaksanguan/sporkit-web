import type { Metadata } from 'next'
import './admin.css'

// Private page: never indexed, never cached.
export const metadata: Metadata = {
  title: 'SporkIt Admin',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>
}
