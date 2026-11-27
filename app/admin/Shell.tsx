'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import AdminLogo from './AdminLogo'
import { logout, refreshNow } from './actions'
import { adviceFor, topText } from './advice'
import BunnyPage from './BunnyPage'
import UsersPanel from './UsersPanel'
import type { UserStats } from './userStats'
import { CARD_CLASS, LOGOS, PLAIN_LOGOS, StatusPill, type Level, type Snapshot } from './status'

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

export default function Shell({ snapshots, stats }: { snapshots: Snapshot[]; stats: UserStats }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('client')
  const [view, setView] = useState<'bunny' | null>(null)
  const [pending, start] = useTransition()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  // Re-read the saved numbers every minute while the tab is visible (no checker run, just a page re-read).
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh()
    }, 60000)
    return () => clearInterval(t)
  }, [router])

  function refresh() {
    start(async () => {
      await refreshNow()
      router.refresh()
      setNow(Date.now())
    })
  }

  // If the checker itself has gone quiet, say so loudly: it cannot email about its own death.
  const newest = snapshots.reduce((m, s) => Math.max(m, new Date(s.checked_at).getTime()), 0)
  // The checker is shown as a pill beside the title, not as a card, and is left out of the counts.
  const checker = snapshots.find((s) => s.service === 'checker')
  const checkerAge = checker ? now - new Date(checker.checked_at).getTime() : 0
  const checkerStopped = checker ? checkerAge > STALE_MIN * 60000 : false
  // Fullest first (percent of limit); cards with no bar sort last, then by title.
  const pct = (c: Snapshot) => (typeof c.detail?.meter?.percent === 'number' ? c.detail.meter.percent : -1)
  const cards: Snapshot[] = snapshots
    .filter((s) => s.service !== 'checker')
    .sort((a, b) => pct(b) - pct(a) || a.title.localeCompare(b.title))
  const act = cards.filter((c) => c.level === 'act')
  const watch = cards.filter((c) => c.level === 'watch')
  const fine = cards.filter((c) => c.level === 'fine')
  const attention = [...act, ...watch]
  const top: Level = act.length ? 'act' : watch.length ? 'watch' : 'fine'

  const Card = ({ c }: { c: Snapshot }) => (
    <div className={CARD_CLASS[c.level]}>
      <div className="hd">
        <span className="ttl">
          {LOGOS[c.service] ? <span className={'lg' + (PLAIN_LOGOS.has(c.service) ? ' n' : '')}>{LOGOS[c.service]}</span> : null}
          <b>{c.title}</b>
        </span>
        <StatusPill level={c.level} />
      </div>
      {c.detail?.label ? <div className="lbl cap">{c.detail.label}</div> : null}
      <div className="numrow">
        <div className="big">{c.value || '-'}</div>
        {typeof c.detail?.meter?.percent === 'number' ? (
          <div className="bar" role="img" aria-label={`${Math.round(c.detail.meter.percent)} percent of the limit used`}>
            <i style={{ width: c.detail.meter.percent + '%' }} />
            <b style={{ left: '60%' }} />
            <b style={{ left: '80%' }} />
          </div>
        ) : null}
      </div>
      {c.detail?.rows?.length ? (
        <div className="rows">
          {c.detail.rows.map((r) => (
            <div className="row" key={r.label}>
              <span>{r.label}</span>
              <b>{r.value}</b>
            </div>
          ))}
        </div>
      ) : null}
      {c.detail?.groups?.length ? (
        <div className="rows">
          {c.detail.groups.map((g) => (
            <div className="grp" key={g.title}>
              <div className="gt">{g.title}</div>
              {g.rows.map((r) => (
                <div className="row" key={r.label}>
                  <span>{r.label}</span>
                  <b>{r.value}</b>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
      {c.service === 'bunny' ? <button className="detail-link" onClick={() => setView('bunny')}>View details</button> : null}
      {c.detail?.link?.url?.startsWith('https://') ? (
        <a className="more" href={c.detail.link.url} target="_blank" rel="noopener noreferrer">
          <span>{c.detail.link.label}</span>
          <svg viewBox="0 0 256 256" aria-hidden="true"><path d="M228 104a12 12 0 0 1-24 0V69l-59.51 59.51a12 12 0 0 1-17-17L187 52h-35a12 12 0 0 1 0-24h64a12 12 0 0 1 12 12Zm-44 24a12 12 0 0 0-12 12v64H52V84h64a12 12 0 0 0 0-24H48a20 20 0 0 0-20 20v128a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20v-68a12 12 0 0 0-12-12" /></svg>
        </a>
      ) : null}
    </div>
  )

  return (
    <div className="wrap">
      <div className="hdr">
        <AdminLogo />
        <nav className="nav" aria-label="Dashboard">
          <button className={'tab' + (tab === 'client' ? ' on' : '')} onClick={() => setTab('client')}>
            Users
            {stats.health.claims + stats.health.reports > 0 ? <span className="bd bd-w" aria-label={`${stats.health.claims + stats.health.reports} waiting for you`}>{stats.health.claims + stats.health.reports}</span> : null}
          </button>
          <button className={'tab' + (tab === 'server' ? ' on' : '')} onClick={() => setTab('server')}>
            Services
            {act.length > 0 ? <span className="bd bd-a" aria-label={`${act.length} need action`}>{act.length}</span> : null}
            {watch.length > 0 ? <span className="bd bd-w" aria-label={`${watch.length} to watch`}>{watch.length}</span> : null}
          </button>
        </nav>
      </div>
      <div className="upd">
        <span className="ptw">
          <span className="pt">{tab === 'server' ? 'Status summary' : 'User activity'}</span>
          {tab === 'server' && checker ? (
            <StatusPill
              level={checkerStopped ? 'act' : 'fine'}
              text={checkerStopped ? `Checker stopped, last ran ${ago(checkerAge)}` : 'Checker running'}
            />
          ) : null}
        </span>
        <span className="rt">
          <button className={'rf' + (pending ? ' go' : '')} onClick={refresh} disabled={pending} aria-label="Refresh" title="Refresh">
            <svg viewBox="0 0 256 256" aria-hidden="true"><path d={REFRESH} /></svg>
          </button>
          <span>{newest ? `Updated ${ago(now - newest)}` : 'No data yet'}</span>
          <span className="sep" aria-hidden="true" />
          <form action={logout}><button className="out" type="submit">Sign out</button></form>
        </span>
      </div>

      {tab === 'server' && view === 'bunny' && cards.find((x) => x.service === 'bunny') ? (
        (() => {
          const b = cards.find((x) => x.service === 'bunny')!
          const a = adviceFor(b)
          return (
            <BunnyPage
              c={b}
              onBack={() => setView(null)}
              advice={a ? <div className="adv" style={{ marginTop: 10 }}><div>{a.why}</div><ol>{a.steps.map((st) => <li key={st}>{st}</li>)}</ol></div> : null}
            />
          )
        })()
      ) : tab === 'server' ? (
        cards.length === 0 ? (
          <div className="card"><b>No data yet</b><div className="lbl">The checker has not saved any numbers. It runs every 5 minutes.</div></div>
        ) : (
          <>
            <div className={'card summary ' + (top === 'act' ? 'ac-b' : top === 'watch' ? 'wa-b' : '')}>
              <StatusPill level={top} />
              <div className="sum-stats">
                <div className="sum-s"><span className="sum-n">{act.length}</span><span className="sum-l">Needs action</span></div>
                <div className="sum-s"><span className="sum-n">{watch.length}</span><span className="sum-l">To watch</span></div>
                <div className="sum-s"><span className="sum-n">{fine.length}</span><span className="sum-l">Fine</span></div>
              </div>
              <div className="sum-adv">
                <div className="sum-note">{topText(top)}</div>
                {attention.map((c) => {
                  const a = adviceFor(c)
                  return a ? (
                    <div className="adv" key={c.service}>
                      <b>{c.title}</b>
                      <div>{a.why}</div>
                      <ol>{a.steps.map((st) => <li key={st}>{st}</li>)}</ol>
                    </div>
                  ) : null
                })}
              </div>
            </div>
            <div className="sec">Requires attention</div>
            {attention.length > 0 ? (
              <div className="grid">{attention.map((c) => <Card key={c.service} c={c} />)}</div>
            ) : (
              <div className="card summary">
                <StatusPill level="fine" />
                <div>
                  <div className="sum-t">Nothing requires attention right now</div>
                </div>
              </div>
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
        <UsersPanel s={stats} />
      )}
    </div>
  )
}
