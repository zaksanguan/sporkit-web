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

export function StatusPill({ level, text }: { level: Level; text?: string }): ReactNode {
  return (
    <span className={'st ' + CLASS[level]}>
      <svg className="pi" viewBox="0 0 256 256" aria-hidden="true"><path d={PATHS[level]} /></svg>
      {text ?? WORD[level]}
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
  // Bunny: the real mark, copied from the approved mock.
  bunny: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#FFAA49"
        d="m12.978 3.828 5.642 3.104L13.436 0c-.86 1.126-1.033 2.59-.459 3.828ZM10.398 15.03c.688 0 1.262.563 1.262 1.294 0 .676-.574 1.239-1.32 1.239-.688 0-1.261-.563-1.261-1.239.057-.675.63-1.294 1.32-1.294ZM6.497 1.033l15.832 8.444c.402.169.516.62.344 1.013a.512.512 0 0 1-.344.338 10.919 10.919 0 0 1-3.9 1.463l-3.328 6.643s-1.032 2.308-3.9 1.407c1.204-1.182 2.638-2.252 2.638-4.053 0-1.914-1.549-3.434-3.499-3.434-1.95 0-3.5 1.52-3.5 3.434 0 2.364 2.41 3.378 3.73 5.01.573.844.516 1.97-.173 2.702-1.606-1.576-4.76-4.278-6.08-6.023a5.55 5.55 0 0 1-1.147-3.096c.114-2.477 1.835-4.616 4.244-5.348.746-.225 1.492-.281 2.238-.281 1.032.056 2.065.394 2.983.9 1.434.789 2.065.62 3.04-.225.573-.45 1.204-1.97.23-2.308a6.096 6.096 0 0 0-.976-.225C13.152 7.056 9.994 6.72 8.847 6.1 7.01 5.087 5.749 3.003 6.497 1.034ZM2.46 8.656c.631 0 1.21.516 1.21 1.187v1.186H2.46c-.631 0-1.21-.516-1.21-1.186 0-.62.526-1.187 1.21-1.187Z"
      />
    </svg>
  ),
  // The Website card shows the SporkIt logo (orange circle, spork top-aligned, never centred).
  vercel: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#FF8C00" />
      <svg x="7.3" y="1" width="9.4" height="15.3" viewBox="0 0 78 127">
        <path fill="#0F0F0F" d="M38.4995 0C42.968 0 45.9579 0.4931 45.9995 0.5C44.4995 4.99985 43.9995 15.5 43.9995 15.5C43.9985 15.5168 43.5 24.0034 43.9995 27.5C44.8545 30.0718 45.7997 32.0001 49.9995 35C58.5534 41.1099 70.4995 45.5001 75.9995 66.5C81.011 85.6347 68.4995 113 53.4995 122C53.3328 113.167 52.7995 94.6 51.9995 93C51.3327 92.5 49.8992 91.8002 47.4995 93L45.9995 125.5C45.6659 125.833 44.4991 126.5 42.4995 126.5L41.4995 93C41.17 92.8354 40.1265 92.5093 38.561 92.501C36.9958 92.5095 35.9526 92.8355 35.6235 93L34.6235 126.5C32.6236 126.5 31.4569 125.833 31.1235 125.5L29.6235 93C27.2236 91.8 25.7902 92.5 25.1235 93C24.3235 94.6 23.7902 113.167 23.6235 122C8.62353 113 -3.88793 85.6347 1.12352 66.5C6.62353 45.5 18.5696 41.1099 27.1235 35C31.3235 32 32.2685 30.0719 33.1235 27.5C33.6233 24.0015 33.1239 15.5072 33.1235 15.5C33.1235 15.5 32.6235 4.99985 31.1235 0.5C31.1431 0.496743 34.0832 0.00901329 38.4995 0Z" />
      </svg>
    </svg>
  ),
}
