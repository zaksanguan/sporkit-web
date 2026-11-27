'use client'

import { CARD_CLASS, StatusPill } from './status'
import { USER_ICONS } from './userIcons'
import type { Level } from './status'
import type { UserStats } from './userStats'

const n = (x: number) => x.toLocaleString('en-US')
const plural = (x: number, one: string, many: string) => (x === 1 ? one : many)
const days = (d: number | null) => (d === null ? '-' : d === 0 ? 'Today' : d + (d === 1 ? ' day' : ' days'))

type Row = [string, string]
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
  const waitingAny = s.health.claims + s.health.reports > 0
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
          <div className="grid">
            <C icon="people" title="Users" cap="New sign-ups today" big={n(s.people.today)}
              rows={[['New last 7 days', n(s.people.week)], ['Previous 7 days', n(s.people.prevWeek)], ['Total users', n(s.people.total)], ['Owners', n(s.people.owners)], ['iPhones with notifications on', n(s.people.pushIos)], ['Android phones with notifications on', n(s.people.pushAndroid)]]} />
            <C icon="posting" title="Posting" cap="Posts today" big={n(s.posting.today)}
              rows={[['Posts last 7 days', n(s.posting.week)], ['Previous 7 days', n(s.posting.prevWeek)], [`${plural(s.posting.posters, 'Person', 'People')} who posted, last 7 days`, n(s.posting.posters)]]} />
            <C icon="sporking" title="Sporking" cap="Sporks today" big={n(s.sporking.today)}
              rows={[['Sporks last 7 days', n(s.sporking.week)], ['Previous 7 days', n(s.sporking.prevWeek)], ['With a review, last 7 days', n(s.sporking.reviews)]]} />
            <C icon="viewing" title="Viewing" cap="Views today" big={n(s.viewing.today)}
              rows={[['Views last 7 days', n(s.viewing.week)], ['Previous 7 days', n(s.viewing.prevWeek)]]}
              note="Counts uploaded videos only, watched 3 seconds by signed-in people." />
            <C icon="health" title="Waiting for you" cap="Claims and reports to review" big={n(s.health.claims + s.health.reports)} level={waitingAny ? 'watch' : 'fine'}
              rows={[['Claims waiting', n(s.health.claims)], ['Oldest claim', days(s.health.claimsOldestDays)], ['Reports waiting', n(s.health.reports)], ['Oldest report', days(s.health.reportsOldestDays)]]} />
          </div>
          <div className="lbl" style={{ marginTop: 14 }}>Page stats, the sign-up funnel and failing screens come with the app events (step 6).</div>
        </>
      )}
    </div>
  )
}
