'use client'

import { CARD_CLASS, StatusPill } from './status'
import { USER_ICONS } from './userIcons'
import type { Level } from './status'
import type { UserStats } from './userStats'
import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type Row = [string, string]
const n = (x: number) => x.toLocaleString('en-US')
const cmp = (w: { period: number; prev: number | null }): Row[] => (w.prev === null ? [['In total', n(w.period)]] : [['This period', n(w.period)], ['Previous period', n(w.prev)]])
const plural = (x: number, one: string, many: string) => (x === 1 ? one : many)
const days = (d: number | null) => (d === null ? '-' : d === 0 ? 'Today' : d + (d === 1 ? ' day' : ' days'))

function C({ icon, title, cap, big, rows, note, level = 'fine' }: { icon: string; title: string; cap: string; big: string; rows: Row[]; note?: string; level?: Level }) {
  return (
    <div className={CARD_CLASS[level]}>
      <div className="hd">
        <span className="ttl"><span className="lg u">{USER_ICONS[icon]}</span><b>{title}</b></span>
        <StatusPill level={level} />
      </div>
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
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [choice, setChoice] = useState<string | null>(null)
  const shown = pending && choice ? choice : String(s.period)
  const waitingAny = s.health.claims + s.health.reports > 0
  const waitingCard = (
    <C icon="health" title="Waiting for you" cap="Claims and reports to review" big={n(s.health.claims + s.health.reports)} level={waitingAny ? 'watch' : 'fine'}
              rows={[['Claims waiting', n(s.health.claims)], ['Oldest claim', days(s.health.claimsOldestDays)], ['Reports waiting', n(s.health.reports)], ['Oldest report', days(s.health.reportsOldestDays)]]} />
  )
  return (
    <div>
      {s.error ? (
        <div className="card"><b>Can&apos;t read the user numbers</b><div className="lbl">Reason: {s.error}</div></div>
      ) : (
        <>
          <div className={'card summary ' + (waitingAny ? 'wa-b' : '')}>
            <StatusPill level={waitingAny ? 'watch' : 'fine'} />
            <div className="sum-stats">
              <div className="sum-s"><span className="sum-n">{s.health.claims}</span><span className="sum-l">{plural(s.health.claims, 'Claim waiting', 'Claims waiting')}</span></div>
              <div className="sum-s"><span className="sum-n">{s.health.reports}</span><span className="sum-l">{plural(s.health.reports, 'Report waiting', 'Reports waiting')}</span></div>
            </div>
            <div className="sum-adv">
              <div className="sum-note">{waitingAny ? 'Nobody is reviewing these but you. They stay here until you deal with them.' : 'Nothing is waiting for you. Claims and reports are all reviewed.'}</div>
              {s.health.claims > 0 ? (
                <div className="adv">
                  <b>Restaurant claims</b>
                  <div>An owner asked to claim a restaurant and is waiting for an answer.</div>
                  <ol><li>Open the proof from the claim email, or the claim_requests table in Supabase.</li><li>Approve it (claim_status approved) or reject it in Supabase.</li></ol>
                </div>
              ) : null}
              {s.health.reports > 0 ? (
                <div className="adv">
                  <b>User reports</b>
                  <div>People reported a video, review, restaurant or user.</div>
                  <ol><li>Open the reports table in Supabase and read the ones with status pending.</li><li>Hide the video if needed, then set the report to reviewed, actioned or dismissed.</li></ol>
                </div>
              ) : null}
            </div>
          </div>
          <div className="sec">Requires attention</div>
          {waitingAny ? (
            <div className="grid">
            {waitingAny ? waitingCard : null}
            </div>
          ) : (
            <div className="card summary">
              <StatusPill level="fine" />
              <div><div className="sum-t">Nothing requires attention right now</div></div>
            </div>
          )}
          <div className="sec secrow">
            <span>Activity</span>
            <label className="per">
              <span>Period</span>
              <span className="selw">
              <select value={shown} onChange={(e) => { const v = e.target.value; setChoice(v); startTransition(() => router.replace(`${pathname}?days=${v}`)) }} aria-label="Period">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              <svg className="chev" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" /></svg>
            </span>
            </label>
          </div>
          <div className="grid" style={{ opacity: pending ? 0.5 : 1, transition: 'opacity .15s' }}>
            <C icon="people" title="Users" cap="New sign-ups today" big={n(s.people.today)}
              rows={[...cmp(s.people), ['Total users', n(s.people.total)], ['Owners', n(s.people.owners)], ['iPhones with notifications on', n(s.people.pushIos)], ['Android with notifications on', n(s.people.pushAndroid)]]} />
            <C icon="posting" title="Posting" cap="Posts today" big={n(s.posting.today)}
              rows={[...cmp(s.posting), [`${plural(s.posting.posters, 'User', 'Users')} who posted`, n(s.posting.posters)], ['Full posts', n(s.posting.full)], [`${plural(s.posting.fullUsers, 'User', 'Users')} with a full post`, n(s.posting.fullUsers)]]} />
            <C icon="sporking" title="Sporking" cap="Sporks today" big={n(s.sporking.today)}
              rows={[...cmp(s.sporking), ['With a review', n(s.sporking.reviews)], ['Full reviews', n(s.sporking.full)], [`${plural(s.sporking.fullUsers, 'User', 'Users')} with a full review`, n(s.sporking.fullUsers)]]} />
            <C icon="viewing" title="Viewing" cap="Views today" big={n(s.viewing.today)}
              rows={[...cmp(s.viewing)]}
              note="Counts uploaded videos only, watched 3 seconds by signed-in people." />
            {waitingAny ? null : waitingCard}
          </div>
          <div className="lbl" style={{ marginTop: 14 }}>Page stats, the sign-up funnel and failing screens come with the app events (step 6).</div>
        </>
      )}
    </div>
  )
}
