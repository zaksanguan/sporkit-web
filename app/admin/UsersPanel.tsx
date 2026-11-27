'use client'

import { StatusPill } from './status'
import { USER_ICONS } from './userIcons'
import type { UserStats, Windows } from './userStats'

const n = (x: number) => x.toLocaleString('en-US')
function trend(w: Windows): string {
  if (w.prevWeek === 0) return w.week === 0 ? '→ no activity in either week' : `↗ ${n(w.week)} this week, none the week before`
  const pct = Math.round(((w.week - w.prevWeek) / w.prevWeek) * 100)
  if (pct === 0) return '→ flat vs the week before'
  return pct > 0 ? `↗ up ${pct}% vs the week before` : `↘ down ${-pct}% vs the week before`
}
const plural = (x: number, one: string, many: string) => (x === 1 ? one : many)
const waiting = (count: number, oldest: number | null) => (count === 0 ? 'none' : `${count}, oldest ${oldest === 0 ? 'today' : oldest + (oldest === 1 ? ' day' : ' days')}`)

function C({ icon, title, big, lines, foot }: { icon: string; title: string; big: string; lines: string[]; foot?: string }) {
  return (
    <div className="card">
      <span className="ttl"><span className="lg n">{USER_ICONS[icon]}</span><b>{title}</b></span>
      <div className="big">{big}</div>
      {lines.map((l) => <div className="lbl" key={l}>{l}</div>)}
      {foot ? <div className="lbl" style={{ marginTop: 4 }}>{foot}</div> : null}
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
            <StatusPill level={waitingAny ? 'watch' : 'fine'} text={waitingAny ? 'Something is waiting for you' : 'Nothing waiting for you'} />
          </div>
          <div className="grid">
            <C icon="people" title="People" big={`${n(s.people.today)} new today`}
              lines={[`7 days: ${n(s.people.week)} new`, `${n(s.people.total)} users in total, ${n(s.people.owners)} ${plural(s.people.owners, 'owner', 'owners')}`, `Push on: ${n(s.people.pushIos)} iPhone, ${n(s.people.pushAndroid)} Android`]}
              foot={trend(s.people)} />
            <C icon="posting" title="Posting" big={`${n(s.posting.today)} ${plural(s.posting.today, 'post', 'posts')} today`}
              lines={[`7 days: ${n(s.posting.week)} from ${n(s.posting.posters)} ${plural(s.posting.posters, 'person', 'people')}`]}
              foot={trend(s.posting)} />
            <C icon="sporking" title="Sporking" big={`${n(s.sporking.today)} ${plural(s.sporking.today, 'spork', 'sporks')} today`}
              lines={[`7 days: ${n(s.sporking.week)}, ${n(s.sporking.reviews)} with a review`]}
              foot={trend(s.sporking)} />
            <C icon="viewing" title="Viewing" big={`${n(s.viewing.today)} ${plural(s.viewing.today, 'view', 'views')} today`}
              lines={[`7 days: ${n(s.viewing.week)}`, 'Uploaded videos only, signed-in people']}
              foot={trend(s.viewing)} />
            <C icon="health" title="Waiting for you" big={s.health.claims + s.health.reports === 0 ? 'Nothing' : `${s.health.claims + s.health.reports} waiting`}
              lines={[`Claims: ${waiting(s.health.claims, s.health.claimsOldestDays)}`, `Reports: ${waiting(s.health.reports, s.health.reportsOldestDays)}`]} />
          </div>
          <div className="lbl" style={{ marginTop: 14 }}>Page stats, the sign-up funnel and failing screens come with the app events (step 6).</div>
        </>
      )}
    </div>
  )
}
