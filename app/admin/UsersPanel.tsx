'use client'

import { StatusPill } from './status'
import { USER_ICONS } from './userIcons'
import type { UserStats, Windows } from './userStats'

const n = (x: number) => x.toLocaleString('en-US')
function trend(w: Windows): string {
  if (w.prevWeek === 0) return w.week === 0 ? 'No activity' : 'New (none last week)'
  const pct = Math.round(((w.week - w.prevWeek) / w.prevWeek) * 100)
  if (pct === 0) return 'Same as last week'
  return pct > 0 ? `Up ${pct}%` : `Down ${-pct}%`
}
const plural = (x: number, one: string, many: string) => (x === 1 ? one : many)
const days = (d: number | null) => (d === null ? '-' : d === 0 ? 'Today' : d + (d === 1 ? ' day' : ' days'))

type Row = [string, string]
function C({ icon, title, cap, big, rows, note }: { icon: string; title: string; cap: string; big: string; rows: Row[]; note?: string }) {
  return (
    <div className="card">
      <span className="ttl"><span className="lg u">{USER_ICONS[icon]}</span><b>{title}</b></span>
      <div className="lbl cap">{cap}</div>
      <div className="big">{big}</div>
      <div className="rows">
        {rows.map(([l, v]) => (
          <div className="row" key={l}><span>{l}</span><b>{v}</b></div>
        ))}
      </div>
      {note ? <div className="lbl" style={{ marginTop: 8 }}>{note}</div> : null}
    </div>
  )
}

export default function UsersPanel({ s }: { s: UserStats }) {
  const waitingAny = s.health.claims + s.health.reports > 0
  return (
    <div>
      {s.error ? (
        <div className="card"><b>Can&apos;t read the user numbers</b><div className="lbl">Reason: {s.error}</div></div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <StatusPill level={waitingAny ? 'watch' : 'fine'} text={waitingAny ? `Waiting for you: ${s.health.claims} ${plural(s.health.claims, 'claim', 'claims')}, ${s.health.reports} ${plural(s.health.reports, 'report', 'reports')}` : 'Nothing waiting for you'} />
          </div>
          <div className="grid">
            <C icon="people" title="People" cap="New sign-ups today" big={n(s.people.today)}
              rows={[['New this week', n(s.people.week)], ['Compared with last week', trend(s.people)], ['Users in total', n(s.people.total)], ['Owners', n(s.people.owners)], ['Push on, iPhone', n(s.people.pushIos)], ['Push on, Android', n(s.people.pushAndroid)]]} />
            <C icon="posting" title="Posting" cap="Posts today" big={n(s.posting.today)}
              rows={[['Posts this week', n(s.posting.week)], ['Compared with last week', trend(s.posting)], [`${plural(s.posting.posters, 'Person', 'People')} who posted this week`, n(s.posting.posters)]]} />
            <C icon="sporking" title="Sporking" cap="Sporks today" big={n(s.sporking.today)}
              rows={[['Sporks this week', n(s.sporking.week)], ['Compared with last week', trend(s.sporking)], ['With a review this week', n(s.sporking.reviews)]]} />
            <C icon="viewing" title="Viewing" cap="Views today" big={n(s.viewing.today)}
              rows={[['Views this week', n(s.viewing.week)], ['Compared with last week', trend(s.viewing)]]}
              note="Counts uploaded videos only, watched 3 seconds by signed-in people." />
            <C icon="health" title="Waiting for you" cap="Claims and reports to review" big={n(s.health.claims + s.health.reports)}
              rows={[['Claims waiting', n(s.health.claims)], ['Oldest claim', days(s.health.claimsOldestDays)], ['Reports waiting', n(s.health.reports)], ['Oldest report', days(s.health.reportsOldestDays)]]} />
          </div>
          <div className="lbl" style={{ marginTop: 14 }}>Page stats, the sign-up funnel and failing screens come with the app events (step 6).</div>
        </>
      )}
    </div>
  )
}
