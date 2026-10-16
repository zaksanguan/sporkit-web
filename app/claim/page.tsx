import type { Metadata } from 'next'
import ClaimForm from '../../components/ClaimForm'
import { supabase } from '../../lib/supabase'

export const metadata: Metadata = {
  title: 'Claim your restaurant — SporkIt',
  description: 'Send proof that you own or manage your restaurant on SporkIt.',
}

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }

export default async function ClaimPage({ searchParams }: Props) {
  const sp = await searchParams
  const r = typeof sp.r === 'string' && /^[0-9a-f-]{36}$/i.test(sp.r) ? sp.r : null

  let restaurant: { id: string; name: string; claim_status: string | null } | null = null
  if (r) {
    const { data } = await supabase.from('restaurants').select('id, name, claim_status').eq('id', r).maybeSingle()
    restaurant = data
  }
  const alreadyClaimed = restaurant?.claim_status === 'approved'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { background: #0F0F0F; color: #FFFFFF; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        .claim { max-width: 560px; margin: 0 auto; padding: 48px 24px 80px; }
        .claim h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        .claim h2 { font-size: 20px; font-weight: 700; color: #FF8C00; margin-bottom: 12px; }
        .claim p { font-size: 15px; line-height: 1.7; color: #CCCCCC; margin-bottom: 16px; }
        .claim a { color: #FF8C00; text-decoration: none; }
        .claim label { display: block; font-size: 14px; font-weight: 600; margin: 20px 0 8px; }
        .claim input, .claim select, .claim textarea { width: 100%; background: #1A1A1A; color: #FFFFFF; border: 1px solid #333333; border-radius: 10px; padding: 12px 14px; font-size: 16px; font-family: inherit; }
        .claim input:focus, .claim select:focus, .claim textarea:focus { outline: none; border-color: #FF8C00; }
        .claim input[type=file] { padding: 10px; }
        .claim select { -webkit-appearance: none; appearance: none; padding-right: 44px; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 256 256' fill='none' stroke='%23999999' stroke-width='32' stroke-linecap='round' stroke-linejoin='round'><polyline points='208 96 128 176 48 96'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; }
        .claim .privacy { font-size: 13px; color: #888888; margin-top: 24px; }
        .claim .error { color: #E34948; font-size: 14px; }
        .logo-link { display: flex; align-items: center; gap: 4px; text-decoration: none; margin-bottom: 32px; }
        .logo-circle { width: 36px; height: 36px; border-radius: 50%; background: #FF8C00; display: flex; align-items: flex-start; justify-content: center; overflow: visible; flex-shrink: 0; }
        .logo-circle svg { margin-top: -1px; }
        .wordmark { font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.7px; }
        .wordmark span { color: #FF8C00; }
        .claim .trust { background: #141414; border: 1px solid #262626; border-radius: 10px; padding: 14px 16px; margin: 24px 0 0; }
        .claim .trust.warn { background: rgba(255,140,0,0.1); border-color: #FF8C00; }
        .claim .trust.warn h3 { display: flex; align-items: center; gap: 8px; }
        .claim .trust.warn p { color: #DDDDDD; }
        .claim .trust h3 { font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 6px; }
        .claim .trust p { font-size: 13px; line-height: 1.6; color: #AAAAAA; margin-bottom: 8px; }
        .claim .trust p:last-child { margin-bottom: 0; }
        .claim .footer { margin-top: 56px; padding-top: 24px; border-top: 1px solid #222222; font-size: 13px; color: #888888; }
        .claim .footer p { font-size: 13px; color: #888888; margin-bottom: 6px; }
        .claim button { width: 100%; margin-top: 8px; background: #FF8C00; color: #0F0F0F; border: 0; border-radius: 999px; padding: 16px; font-size: 17px; font-weight: 700; font-family: inherit; cursor: pointer; }
        .claim button:disabled { opacity: 0.5; cursor: default; }
      `}} />
      <div className="claim">
        <a href="https://sporkitapp.com" className="logo-link">
            <div className="logo-circle">
              <svg width="18" height="30" viewBox="0 0 78 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.4995 0C42.968 0 45.9579 0.4931 45.9995 0.5C44.4995 4.99985 43.9995 15.5 43.9995 15.5C43.9985 15.5168 43.5 24.0034 43.9995 27.5C44.8545 30.0718 45.7997 32.0001 49.9995 35C58.5534 41.1099 70.4995 45.5001 75.9995 66.5C81.011 85.6347 68.4995 113 53.4995 122C53.3328 113.167 52.7995 94.6 51.9995 93C51.3327 92.5 49.8992 91.8002 47.4995 93L45.9995 125.5C45.6659 125.833 44.4991 126.5 42.4995 126.5L41.4995 93C41.17 92.8354 40.1265 92.5093 38.561 92.501C36.9958 92.5095 35.9526 92.8355 35.6235 93L34.6235 126.5C32.6236 126.5 31.4569 125.833 31.1235 125.5L29.6235 93C27.2236 91.8 25.7902 92.5 25.1235 93C24.3235 94.6 23.7902 113.167 23.6235 122C8.62353 113 -3.88793 85.6347 1.12352 66.5C6.62353 45.5 18.5696 41.1099 27.1235 35C31.3235 32 32.2685 30.0719 33.1235 27.5C33.6233 24.0015 33.1239 15.5072 33.1235 15.5C33.1235 15.5 32.6235 4.99985 31.1235 0.5C31.1431 0.496743 34.0832 0.00901329 38.4995 0Z" fill="#0F0F0F"/>
              </svg>
            </div>
            <div className="wordmark">Spork<span>It</span></div>
          </a>
        {alreadyClaimed ? (
          <>
            <h1>Claim your restaurant</h1>
            <h2>{restaurant!.name} already has a verified owner</h2>
            <p>If you are the real owner, email <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a> with your proof and we will look into it.</p>
          </>
        ) : (
          <ClaimForm restaurantId={restaurant?.id ?? null} restaurantName={restaurant?.name ?? ''} />
        )}
        <div className="footer">
          <p>© 2026 SporkIt · <a href="https://sporkitapp.com">sporkitapp.com</a></p>
          <p><a href="https://sporkitapp.com/privacy">Privacy Policy</a> · <a href="https://sporkitapp.com/terms">Terms of Service</a> · <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a></p>
        </div>
      </div>
    </>
  )
}
