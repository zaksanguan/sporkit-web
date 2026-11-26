'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import AdminLogo from './AdminLogo'
import { logout, refreshNow } from './actions'
import { CARD_CLASS, StatusPill, type Level, type Snapshot } from './status'

// Phosphor ArrowClockwise (bold), same icon set as the app.
const REFRESH = 'M244 56v48a12 12 0 0 1-12 12h-48a12 12 0 1 1 0-24h17.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76 76 0 1 0 127 204h1a75.53 75.53 0 0 0 52.15-20.72 12 12 0 0 1 16.49 17.45A99.45 99.45 0 0 1 128 228h-1.37a100 100 0 1 1 71.88-170.94L220 76.72V56a12 12 0 0 1 24 0'

type Tab = 'server' | 'client'
const STALE_MIN = 15 // the checker runs every 5 min; 15 min of silence means it stopped

function ago(ms: number): string {
  const m = Math.max(0, Math.floor(ms / 60000))
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h} h ago` : `${Math.floor(h / 24)} d ago`
}

export default function Shell({ snapshots }: { snapshots: Snapshot[] }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('server')
  const [pending, start] = useTransition()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  function refresh() {
    start(async () => {
      await refreshNow()
      router.refresh()
      setNow(Date.now())
    })
  }

  // If the checker itself has gone quiet, say so loudly: it cannot email about its own death.
  const newest = snapshots.reduce((m, s) => Math.max(m, new Date(s.checked_at).getTime()), 0)
  const cards: Snapshot[] = snapshots.map((s) => {
    if (s.service === 'checker' && now - new Date(s.checked_at).getTime() > STALE_MIN * 60000) {
      return { ...s, level: 'act' as Level, value: `Stopped, last ran ${ago(now - new Date(s.checked_at).getTime())}` }
    }
    return s
  })
  const act = cards.filter((c) => c.level === 'act')
  const watch = cards.filter((c) => c.level === 'watch')
  const fine = cards.filter((c) => c.level === 'fine')
  const attention = [...act, ...watch]
  const top: Level = act.length ? 'act' : watch.length ? 'watch' : 'fine'

  const Card = ({ c }: { c: Snapshot }) => (
    <div className={CARD_CLASS[c.level]}>
      <div className="hd">
        <b>{c.title}</b>
        <StatusPill level={c.level} />
      </div>
      <div className="big">{c.value || '-'}</div>
    </div>
  )

  return (
    <div className="wrap">
      <div className="hdr">
        <AdminLogo />
        <nav className="nav" aria-label="Dashboard">
          <button className={'tab' + (tab === 'server' ? ' on' : '')} onClick={() => setTab('server')}>Services</button>
          <button className={'tab' + (tab === 'client' ? ' on' : '')} onClick={() => setTab('client')}>Users</button>
        </nav>
      </div>
      <div className="upd">
        <span className="pt">{tab === 'server' ? 'Summary' : 'User activity'}</span>
        <span className="rt">
          <button className={'rf' + (pending ? ' go' : '')} onClick={refresh} disabled={pending} aria-label="Refresh" title="Refresh">
            <svg viewBox="0 0 256 256" aria-hidden="true"><path d={REFRESH} /></svg>
          </button>
          <span>{newest ? `Updated ${ago(now - newest)}` : 'No data yet'}</span>
          <span className="sep" aria-hidden="true" />
          <form action={logout}><button className="out" type="submit">Sign out</button></form>
        </span>
      </div>

      {tab === 'server' ? (
        cards.length === 0 ? (
          <div className="card"><b>No data yet</b><div className="lbl">The checker has not saved any numbers. It runs every 5 minutes.</div></div>
        ) : (
          <>
            <div className={'card summary ' + (top === 'act' ? 'ac-b' : top === 'watch' ? 'wa-b' : '')}>
              <StatusPill level={top} />
              <div>
                <div className="sum-t">{act.length} needs action, {watch.length} to watch, {fine.length} fine</div>
              </div>
            </div>
            {attention.length > 0 && (
              <>
                <div className="sec">Needs your attention first</div>
                <div className="grid">{attention.map((c) => <Card key={c.service} c={c} />)}</div>
              </>
            )}
            {fine.length > 0 && (
              <>
                <div className="sec">Services</div>
                <div className="grid">{fine.map((c) => <Card key={c.service} c={c} />)}</div>
              </>
            )}
          </>
        )
      ) : (
        <div className="card">
          <b>No user data yet</b>
          <div className="lbl">Sign-ups, posts, sporks and views appear here once they are connected (step 5).</div>
        </div>
      )}
    </div>
  )
}
