import type { ReactNode } from 'react'

export type Level = 'fine' | 'watch' | 'act'
export type Snapshot = { service: string; title: string; value: string; level: Level; detail?: { label?: string; meter?: { percent: number }; link?: { label: string; url: string }; rows?: { label: string; value: string }[] } | null; checked_at: string }

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
  // The Website card uses Phosphor "desktop" (fill), on the white tile like the other cards.
  vercel: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path
        fill="#1d1d1b"
        d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24h72v16H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V200h72a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm0,144H48a8,8,0,0,1-8-8V160H216v16A8,8,0,0,1,208,184Z"
      />
    </svg>
  ),
}

// (Resend mark copied from the approved mock.)
LOGOS.resend = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#1d1d1b"
      d="M14.679 0c4.648 0 7.413 2.765 7.413 6.434s-2.765 6.434-7.413 6.434H12.33L24 24h-8.245l-8.88-8.44c-.636-.588-.93-1.273-.93-1.86 0-.831.587-1.565 1.713-1.883l4.574-1.224c1.737-.465 2.936-1.81 2.936-3.572 0-2.153-1.761-3.4-3.939-3.4H0V0z"
    />
  </svg>
)

// (Supabase mark copied from the approved mock.)
LOGOS.supabase = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#3FCF8E"
      d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z"
    />
  </svg>
)

// (Google Places mark copied from the approved mock.)
LOGOS.places = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z"
    />
  </svg>
)

// (Sentry mark copied from the approved mock.)
LOGOS.sentry = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#362D59"
      d="M13.91 2.505c-.873-1.448-2.972-1.448-3.844 0L6.904 7.92a15.478 15.478 0 0 1 8.53 12.811h-2.221A13.301 13.301 0 0 0 5.784 9.814l-2.926 5.06a7.65 7.65 0 0 1 4.435 5.848H2.194a.365.365 0 0 1-.298-.534l1.413-2.402a5.16 5.16 0 0 0-1.614-.913L.296 19.275a2.182 2.182 0 0 0 .812 2.999 2.24 2.24 0 0 0 1.086.288h6.983a9.322 9.322 0 0 0-3.845-8.318l1.11-1.922a11.47 11.47 0 0 1 4.95 10.24h5.915a17.242 17.242 0 0 0-7.885-15.28l2.244-3.845a.37.37 0 0 1 .504-.13c.255.14 9.75 16.708 9.928 16.9a.365.365 0 0 1-.327.543h-2.287c.029.612.029 1.223 0 1.831h2.297a2.206 2.206 0 0 0 1.922-3.31z"
    />
  </svg>
)

// (Expo mark copied from the approved mock.)
LOGOS.expo = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#1C2024"
      d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z"
    />
  </svg>
)

// (Renewals calendar icon copied from the approved mock: a plain icon, no white tile.)
LOGOS.renewals = (
  <svg viewBox="0 0 256 256" aria-hidden="true">
    <path
      fill="currentColor"
      d="M208 28h-20v-4a12 12 0 0 0-24 0v4H92v-4a12 12 0 0 0-24 0v4H48a20 20 0 0 0-20 20v160a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V48a20 20 0 0 0-20-20M68 52a12 12 0 0 0 24 0h72a12 12 0 0 0 24 0h16v24H52V52ZM52 204V100h152v104Zm120.49-84.49a12 12 0 0 1 0 17l-48 48a12 12 0 0 1-17 0l-24-24a12 12 0 0 1 17-17L116 159l39.51-39.52a12 12 0 0 1 16.98.03"
    />
  </svg>
)

// Services whose mark is a plain icon (no white tile), as in the approved mock.
export const PLAIN_LOGOS = new Set<string>(['renewals'])
