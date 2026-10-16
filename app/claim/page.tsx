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
        .claim button { width: 100%; margin-top: 8px; background: #FF8C00; color: #0F0F0F; border: 0; border-radius: 999px; padding: 16px; font-size: 17px; font-weight: 700; font-family: inherit; cursor: pointer; }
        .claim button:disabled { opacity: 0.5; cursor: default; }
      `}} />
      <div className="claim">
        {alreadyClaimed ? (
          <>
            <h1>Claim your restaurant</h1>
            <h2>{restaurant!.name} already has a verified owner</h2>
            <p>If you are the real owner, email <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a> with your proof and we will look into it.</p>
          </>
        ) : (
          <ClaimForm restaurantId={restaurant?.id ?? null} restaurantName={restaurant?.name ?? ''} />
        )}
      </div>
    </>
  )
}
