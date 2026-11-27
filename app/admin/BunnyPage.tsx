'use client'

import type { ReactNode } from 'react'
import { StatusPill, LOGOS, CARD_CLASS, type Snapshot } from './status'

const gb = (b: number) => (b / 1024 ** 3 >= 10 ? (b / 1024 ** 3).toFixed(0) : (b / 1024 ** 3).toFixed(2)) + ' GB'
const usd = (n: number) => '$' + n.toFixed(2)

function Tile({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="tile">
      <div className="lbl">{label}</div>
      <div className="big">{value}</div>
      {sub ? <div className="lbl">{sub}</div> : null}
    </div>
  )
}

function HourChart({ hours }: { hours: { hour: number; avg: number; posts: number }[] }) {
  if (hours.length === 0) return <div className="lbl">No uploads yet today.</div>
  const W = 640, H = 170, L = 34, B = 24
  const maxAvg = Math.max(12, ...hours.map((h) => h.avg))
  const y = (m: number) => H - B - (m / maxAvg) * (H - B - 10)
  const slot = (W - L) / 24
  return (
    <svg viewBox={`0 0 ${W} ${H + 8}`} width="100%" role="img" aria-label="Average upload wait by hour today">
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#E34948" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1d1d1b" strokeWidth="3" />
        </pattern>
      </defs>
      {[5, 10].map((m) => (
        <g key={m}>
          <line x1={L} x2={W} y1={y(m)} y2={y(m)} stroke="currentColor" strokeDasharray="4 4" opacity=".5" />
          <text x="2" y={y(m) + 4} fontSize="11" fill="currentColor" opacity=".8">{m} min</text>
        </g>
      ))}
      {hours.map((h) => {
        const x = L + h.hour * slot + 3
        const top = y(Math.max(h.avg, 0.4))
        const fill = h.avg > 10 ? 'url(#hatch)' : h.avg > 5 ? '#FFD700' : '#6b6a64'
        return (
          <g key={h.hour}>
            <rect x={x} y={top} width={slot - 6} height={H - B - top} rx="3" fill={fill} />
            <text x={x + (slot - 6) / 2} y={top - 3} fontSize="10" textAnchor="middle" fill="currentColor" opacity=".8">{h.avg}</text>
            <text x={x + (slot - 6) / 2} y={H - 8} fontSize="11" textAnchor="middle" fill="currentColor" opacity=".7">{h.hour}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function BunnyPage({ c, advice, onBack }: { c: Snapshot; advice: ReactNode; onBack: () => void }) {
  const d = c.detail
  const w = d?.wait
  const lib = d?.library
  const ch = d?.charges
  const stuck = d?.stuckList ?? []
  return (
    <div>
      <button className="back" onClick={onBack}>← Back to Services</button>
      <div className={CARD_CLASS[c.level]} style={{ marginBottom: 14 }}>
        <div className="hd">
          <span className="ttl">
            {LOGOS.bunny ? <span className="lg">{LOGOS.bunny}</span> : null}
            <b>Bunny</b>
          </span>
          <StatusPill level={c.level} />
        </div>
        <div className="big">{c.value}</div>
        <div className="lbl">Balance. Uploads are processed by Bunny before a post goes live.</div>
        {advice}
      </div>
      {w ? (
        <div className="tiles">
          <Tile label="Total uploads today" value={w.postsToday} />
          <Tile label="Uploads over 5 min" value={w.over5Today} sub="today" />
          <Tile label="Uploads over 10 min" value={w.over10Today} sub="today" />
          <Tile label="People affected, last 7 days" value={`${w.peopleOver10} of ${w.peopleWeek}`} sub="had an upload over 10 min" />
          <Tile label="Balance" value={typeof d?.balance === 'number' ? usd(d.balance) : '-'} sub={d?.rows?.find((r) => r.label === 'Spent this month') ? 'spent this month ' + d.rows.find((r) => r.label === 'Spent this month')!.value : undefined} />
          {lib ? (
            <Tile
              label="Storage / traffic"
              value={`${gb(lib.storageBytes)} / ${gb(lib.trafficBytes)}`}
              sub={ch ? `this month: storage ${usd(ch.storage)}, traffic ${usd(ch.traffic)}` + (ch.encoding > 0 ? `, encoding ${usd(ch.encoding)}` : '') : undefined}
            />
          ) : null}
        </div>
      ) : null}
      <div className="sec">Average wait by hour today (Bangkok time)</div>
      <div className="card">{w ? <HourChart hours={w.hours} /> : <div className="lbl">No data yet.</div>}</div>
      <div className="sec">Stuck posts</div>
      <div className="card">
        {stuck.length === 0 ? (
          <div className="lbl">No posts are stuck. A post counts as stuck after 30 minutes without going live.</div>
        ) : (
          stuck.map((s, i) => (
            <div className="row" key={i} style={i === 0 ? { borderTop: 0 } : undefined}>
              <span><b>{s.dish}</b> · waiting {s.waitMin} min</span>
            </div>
          ))
        )}
        <a className="more" href="https://dash.bunny.net/stream" target="_blank" rel="noopener noreferrer">
          <span>Open Bunny</span>
          <svg viewBox="0 0 256 256" aria-hidden="true"><path d="M228 104a12 12 0 0 1-24 0V69l-59.51 59.51a12 12 0 0 1-17-17L187 52h-35a12 12 0 0 1 0-24h64a12 12 0 0 1 12 12Zm-44 24a12 12 0 0 0-12 12v64H52V84h64a12 12 0 0 0 0-24H48a20 20 0 0 0-20 20v128a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20v-68a12 12 0 0 0-12-12" /></svg>
        </a>
      </div>
    </div>
  )
}
