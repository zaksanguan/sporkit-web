import type { ReactNode } from 'react'

export type Level = 'fine' | 'watch' | 'act'
export type Snapshot = { service: string; title: string; value: string; level: Level; detail?: { label?: string; rows?: { label: string; value: string }[] } | null; checked_at: string }

// Phosphor icons (bold), same set as the app. Shape + word, never colour alone:
// Fine = check circle, Watch = eye, Act now = warning octagon.
const PATHS: Record<Level, string> = {
  fine: 'M176.49 95.51a12 12 0 0 1 0 17l-56 56a12 12 0 0 1-17 0l-24-24a12 12 0 1 1 17-17L112 143l47.51-47.52a12 12 0 0 1 16.98.03M236 128A108 108 0 1 1 128 20a108.12 108.12 0 0 1 108 108m-24 0a84 84 0 1 0-84 84 84.09 84.09 0 0 0 84-84',
  watch: 'M251 123.13c-.37-.81-9.13-20.26-28.48-39.61C196.63 57.67 164 44 128 44S59.37 57.67 33.51 83.52C14.16 102.87 5.4 122.32 5 123.13a12.08 12.08 0 0 0 0 9.75c.37.82 9.13 20.26 28.49 39.61C59.37 198.34 92 212 128 212s68.63-13.66 94.48-39.51c19.36-19.35 28.12-38.79 28.49-39.61a12.08 12.08 0 0 0 .03-9.75m-46.06 33C183.47 177.27 157.59 188 128 188s-55.47-10.73-76.91-31.88A130.4 130.4 0 0 1 29.52 128a130.5 130.5 0 0 1 21.57-28.11C72.54 78.73 98.41 68 128 68s55.46 10.73 76.91 31.89A130.4 130.4 0 0 1 226.48 128a130.5 130.5 0 0 1-21.57 28.12ZM128 84a44 44 0 1 0 44 44 44.05 44.05 0 0 0-44-44m0 64a20 20 0 1 1 20-20 20 20 0 0 1-20 20',
  act: 'M116 132V80a12 12 0 0 1 24 0v52a12 12 0 0 1-24 0m120-40.45v72.9a19.86 19.86 0 0 1-5.86 14.14l-51.55 51.55a19.85 19.85 0 0 1-14.14 5.86h-72.9a19.85 19.85 0 0 1-14.14-5.86l-51.55-51.55A19.86 19.86 0 0 1 20 164.45v-72.9a19.86 19.86 0 0 1 5.86-14.14l51.55-51.55A19.85 19.85 0 0 1 91.55 20h72.9a19.85 19.85 0 0 1 14.14 5.86l51.55 51.55A19.86 19.86 0 0 1 236 91.55m-24 1.66L162.79 44H93.21L44 93.21v69.58L93.21 212h69.58L212 162.79ZM128 156a16 16 0 1 0 16 16 16 16 0 0 0-16-16',
}
export const WORD: Record<Level, string> = { fine: 'Fine', watch: 'Watch', act: 'Act now' }
const CLASS: Record<Level, string> = { fine: 'ok', watch: 'wa', act: 'ac' }

export function StatusPill({ level }: { level: Level }): ReactNode {
  return (
    <span className={'st ' + CLASS[level]}>
      <svg className="pi" viewBox="0 0 256 256" aria-hidden="true"><path d={PATHS[level]} /></svg>
      {WORD[level]}
    </span>
  )
}

export const CARD_CLASS: Record<Level, string> = { fine: 'card', watch: 'card wa-b', act: 'card ac-b' }

// Brand marks for the service cards (white rounded square, like the approved mock). Add one per service as it is connected.
// Twilio is not in the simple-icons set, so this is the simplified mark from the mock (red circle, four dots).
export const LOGOS: Record<string, ReactNode> = {
  twilio: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#F22F46" />
      <circle cx="8.6" cy="8.6" r="2" fill="#fff" />
      <circle cx="15.4" cy="8.6" r="2" fill="#fff" />
      <circle cx="8.6" cy="15.4" r="2" fill="#fff" />
      <circle cx="15.4" cy="15.4" r="2" fill="#fff" />
    </svg>
  ),
}
