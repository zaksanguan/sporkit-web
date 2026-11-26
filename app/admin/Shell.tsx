'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLogo from './AdminLogo'
import { logout } from './actions'

// Phosphor ArrowClockwise (bold), same icon set as the app.
const REFRESH = 'M244 56v48a12 12 0 0 1-12 12h-48a12 12 0 1 1 0-24h17.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76 76 0 1 0 127 204h1a75.53 75.53 0 0 0 52.15-20.72 12 12 0 0 1 16.49 17.45A99.45 99.45 0 0 1 128 228h-1.37a100 100 0 1 1 71.88-170.94L220 76.72V56a12 12 0 0 1 24 0'

type Tab = 'server' | 'client'

export default function Shell() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('server')
  const [spin, setSpin] = useState(false)

  function refresh() {
    setSpin(true)
    router.refresh()
    setTimeout(() => setSpin(false), 700)
  }

  return (
    <div className="wrap">
      <div className="hdr">
        <AdminLogo />
        <nav className="nav" aria-label="Dashboard">
          <button className={'tab' + (tab === 'server' ? ' on' : '')} onClick={() => setTab('server')}>Server</button>
          <button className={'tab' + (tab === 'client' ? ' on' : '')} onClick={() => setTab('client')}>Client</button>
        </nav>
      </div>
      <div className="upd">
        <span className="pt">{tab === 'server' ? 'Latest status' : 'Client activity'}</span>
        <span className="rt">
          <span>No data yet</span>
          <button className={'rf' + (spin ? ' go' : '')} onClick={refresh} aria-label="Refresh" title="Refresh">
            <svg viewBox="0 0 256 256" aria-hidden="true"><path d={REFRESH} /></svg>
          </button>
          <form action={logout}><button className="out" type="submit">Sign out</button></form>
        </span>
      </div>
      <div className="card">
        <b>You are signed in</b>
        <div className="lbl">
          The admin page is set up and locked. Services are connected one by one (Twilio, Bunny, Supabase and the rest), so this {tab} view is empty for now.
        </div>
      </div>
    </div>
  )
}
