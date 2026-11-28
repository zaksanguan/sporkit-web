import type { Level, Snapshot } from './status'

// Plain-words help shown in the status summary: what a Watch / Act now means for each service and what to do.
// Causes are POSSIBILITIES: the dashboard sees numbers, not the reason behind them.
export type Advice = { why: string; steps: string[] }
type Entry = { watch?: Advice; act?: Advice }

const ADVICE: Record<string, Entry> = {
  youtube_videos: {
    watch: {
      why: 'Some YouTube videos no longer play (deleted, private, blocked in Thailand, age-restricted or embedding switched off), or the daily check is late. People would see a dead screen.',
      steps: ['Press View details on the YouTube videos card.', 'Watch each video, then press Hide on the ones that do not play. Sporks stay, and Unhide brings a video back.'],
    },
  },
  twilio: {
    watch: {
      why: 'More sign-up texts than usual today. Could be real growth, or someone sending fake sign-ups (many different numbers, one country).',
      steps: ['Open Twilio, Monitor, Logs, and look for many texts to numbers from the same country or in quick bursts.'],
    },
    act: {
      why: 'The Twilio balance is low or auto-recharge failed. When it hits zero, nobody can sign up or log in.',
      steps: ['Open Twilio, Billing, and top up the balance.', 'Check the card on file and turn auto-recharge on.', 'Press refresh on this page.'],
    },
  },
  bunny: {
    watch: {
      why: 'Bunny is getting close to a limit, or uploads are waiting longer than usual to go live. Evenings are slow on the free encoding tier.',
      steps: ['Read the numbers on the Bunny card: balance, posts waiting, spend this month.', 'If many people wait 10+ minutes, consider Premium Encoding ($0.05 per input minute).'],
    },
    act: {
      why: 'Bunny balance is low, or a post is stuck. Uploads can stop working.',
      steps: ['Open Bunny and add balance.', 'Look for posts stuck on "pending" and open them in Bunny.', 'Press refresh on this page.'],
    },
  },
  vercel: {
    watch: {
      why: 'Website traffic is high this month (60% of the free 100 GB). Could be a good day, a bot, or someone linking to our images.',
      steps: ['Open Vercel, Usage, and see which pages use the most transfer.', 'If it keeps climbing, consider Vercel Pro before the free limit ends.'],
    },
    act: {
      why: 'A website page has not loaded for over 5 minutes. People opening shared links or the claim page may see an error.',
      steps: ['Open the page named on the card in a browser.', 'Open Vercel, Deployments, and check the latest one. Roll back to the last good one if it failed.', 'Press refresh on this page.'],
    },
  },
  resend: {
    act: {
      why: 'The daily test email failed, so emails (including these alerts) may not arrive.',
      steps: ['Open Resend and check the domain and the API key.', 'Send a test email from Resend.', 'Press refresh on this page.'],
    },
    watch: {
      why: 'Resend is close to a limit.',
      steps: ['Open Resend, Usage, and check how many emails were sent.'],
    },
  },
  supabase: {
    watch: {
      why: 'The database, file storage or active users passed 60% of the free plan. Could be growth, large uploads, or a table growing too fast.',
      steps: ['Open Supabase, Usage, and see which limit is highest.', 'Check for a table that is much bigger than the others.', 'Plan the Pro plan ($25 a month) before it reaches 80%.'],
    },
    act: {
      why: 'A Supabase free-plan limit is above 80%. At 100% the app can stop saving data.',
      steps: ['Open Supabase, Usage, and see which limit is highest.', 'Free space (old files, big tables) or upgrade to Pro ($25 a month).', 'Press refresh on this page.'],
    },
  },
  places: {
    watch: {
      why: 'Google Places searches today are above 60% of the daily cap. Could be a big seed run, or someone using restaurant search too much.',
      steps: ['If you did not run a seed today, open Google Cloud, Quotas, and look at the Places search count.', 'A steady climb with no seed run can mean abuse: restrict the app key.'],
    },
    act: {
      why: 'Google Places searches today are above 80% of the daily cap. At the cap, restaurant search stops working for everyone until 15:00 Bangkok.',
      steps: ['If it was your seed run, nothing else to do.', 'If not, open Google Cloud, Credentials, and restrict the app key to the iOS and Android app.', 'To keep going today, raise the daily quota in Google Cloud, Quotas.'],
    },
  },
  sentry: {
    watch: {
      why: 'Errors this month are above 60% of the free 5,000. Could be a new bug or a crash loop after a release, or one phone repeating the same error.',
      steps: ['Open Sentry, Issues, sort by Events, and look at the top one.', 'Check if it started after a recent update.'],
    },
    act: {
      why: 'Errors this month are above 80% of the free 5,000. At 100% Sentry stops recording new errors, so real problems would go unseen.',
      steps: ['Open Sentry, Issues, sort by Events, and fix or silence the top issue.', 'If it is noise, ignore that issue in Sentry.', 'Press refresh on this page.'],
    },
  },
  expo: {
    watch: {
      why: 'Expo is getting close to a limit: update users (free plan 1,000 a month) or builds left this month.',
      steps: ['Open Expo, Billing, Usage, and check which one is high.', 'Hold off on non-urgent builds if builds are low.'],
    },
    act: {
      why: 'Expo is almost at a limit. At the limit updates stop reaching users, or no more builds are allowed.',
      steps: ['Open Expo, Billing, Usage, and see which one.', 'If it is update users, consider the Starter plan ($19 a month).', 'If it is builds, wait for the reset on the 1st.'],
    },
  },
  renewals: {
    watch: {
      why: 'A renewal is coming up within 60 days.',
      steps: ['Check that the card on file is valid and auto-renew is on.'],
    },
    act: {
      why: 'A renewal is due within 14 days, or already passed. Missing it can take the app or website offline.',
      steps: ['Renew it now, or confirm auto-renew will charge a valid card.', 'Mark it as checked so this turns Fine.'],
    },
  },
}

const CANT_READ: Advice = {
  why: 'The dashboard could not read this service, so it cannot tell if it is fine. The reason is on the card.',
  steps: ['Fix what the reason says (a missing or expired key, for example).', 'Press refresh on this page.'],
}

export function adviceFor(c: Snapshot): Advice | null {
  if (c.level === 'fine') return null
  if (c.value === "Can't read it") return CANT_READ
  const e = ADVICE[c.service]
  const a = e && (c.level === 'act' ? e.act : e.watch)
  return a ?? { why: c.level === 'act' ? 'This needs action.' : 'This is getting close to a limit.', steps: ['Read the numbers on the card.'] }
}

export const FINE_TEXT = 'Everything is within its limits. Nothing to do.'
export function topText(top: Level): string {
  return top === 'fine' ? FINE_TEXT : top === 'watch' ? 'Yellow means close to a limit or unusual. No action needed yet.' : 'Red means act now. Steps are below.'
}
