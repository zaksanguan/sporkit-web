'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { StatusPill, LOGOS, CARD_CLASS, type Snapshot } from './status'
import { setYoutubeHidden } from './actions'

// One row from the database function admin_youtube_list (supabase/sql/youtube_health.sql).
export type YoutubeItem = {
  video_id: string
  youtube_video_id: string
  caption: string | null
  restaurant_name: string | null
  state: 'ok' | 'age_restricted' | 'not_embeddable' | 'not_returned'
  bad_days: number
  first_bad_at: string | null
  hidden_at: string | null
  sporks: number
}

const WHY: Record<YoutubeItem['state'], string> = {
  age_restricted: 'YouTube marked it age-restricted, so it cannot play in the app.',
  not_embeddable: 'The owner switched off playing outside YouTube.',
  not_returned: 'YouTube no longer shows it: deleted, private or blocked in Thailand.',
  ok: 'Plays again.',
}

const MSG: Record<string, string> = {
  not_found: 'That video was not found.',
  not_active: 'That video is not live any more, so there is nothing to hide.',
  already_hidden: 'Already hidden.',
  not_hidden_by_admin: 'This one was not hidden from this page, so it cannot be unhidden here.',
  error: 'Something went wrong. Nothing was changed.',
}

function Row({ it, first }: { it: YoutubeItem; first: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [note, setNote] = useState('')
  const hidden = !!it.hidden_at
  function go() {
    setNote('')
    start(async () => {
      const r = await setYoutubeHidden(it.video_id, !hidden)
      if (MSG[r.result]) setNote(MSG[r.result])
      router.refresh()
    })
  }
  return (
    <div className="yrow" style={first ? { borderTop: 0 } : undefined}>
      <div className="ymain">
        <b>{it.restaurant_name || '(no restaurant)'}</b>
        <div className="lbl">{it.caption || '(no caption)'}</div>
        {hidden ? (
          <div className="lbl">Hidden by you{it.sporks > 0 ? ` · ${it.sporks} spork${it.sporks === 1 ? '' : 's'} stay` : ''}</div>
        ) : (
          <ul className="ylist">
            <li>Not playing for {it.bad_days} days in a row{it.sporks > 0 ? ` · ${it.sporks} spork${it.sporks === 1 ? '' : 's'} stay` : ''}</li>
            <li>{WHY[it.state]}</li>
          </ul>
        )}
        {note ? <div className="lbl ynote">{note}</div> : null}
      </div>
      <div className="yside">
        <a className="ybtn" href={`https://youtu.be/${it.youtube_video_id}`} target="_blank" rel="noopener noreferrer">Watch</a>
        <button className="ybtn yprim" onClick={go} disabled={pending}>{pending ? (hidden ? 'Unhiding...' : 'Hiding...') : hidden ? 'Unhide' : 'Hide'}</button>
      </div>
    </div>
  )
}

export default function YoutubePage({ c, items, onBack }: { c: Snapshot; items: YoutubeItem[]; onBack: () => void }) {
  const broken = items.filter((i) => !i.hidden_at)
  const hidden = items.filter((i) => i.hidden_at)
  return (
    <div>
      <button className="back" onClick={onBack}>← Back to Services</button>
      <div className={CARD_CLASS[c.level]} style={{ marginBottom: 14 }}>
        <div className="hd">
          <span className="ttl">
            {LOGOS.youtube_videos ? <span className="lg">{LOGOS.youtube_videos}</span> : null}
            <b>YouTube videos</b>
          </span>
          <StatusPill level={c.level} />
        </div>
        <div className="big">{c.value}</div>
        <div className="lbl">A video counts as not playing after 2 bad days in a row. Hiding only takes the video out of the app: sporks, Bites and notifications stay, and Unhide brings it back.</div>
      </div>
      <div className="sec">Not playing</div>
      <div className="card">
        {broken.length === 0 ? <div className="lbl">No broken videos. The check runs every night at 04:00 Bangkok.</div> : broken.map((it, i) => <Row key={it.video_id} it={it} first={i === 0} />)}
      </div>
      {hidden.length > 0 ? (
        <>
          <div className="sec">Hidden by you</div>
          <div className="card">{hidden.map((it, i) => <Row key={it.video_id} it={it} first={i === 0} />)}</div>
        </>
      ) : null}
    </div>
  )
}
