import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const ROLES = ['owner', 'manager', 'other']
const PROOFS = ['utility_bill', 'business_registration', 'license', 'other']
const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' }
const MAX_BYTES = 10 * 1024 * 1024
const isUuid = (v: unknown) => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v)
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// Step 1: validate the form, create the request row, return a signed upload URL for the proof file.
// The file itself goes straight from the browser to the private bucket (Vercel limits request bodies to ~4.5 MB).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return Response.json({ error: 'bad_request' }, { status: 400 })
  if (clean(body.website, 100)) return Response.json({ ok: true })  // honeypot: bots fill this, people never see it

  const restaurantName = clean(body.restaurantName, 200)
  const requesterName  = clean(body.requesterName, 120)
  const contact        = clean(body.contact, 200)
  const notes          = clean(body.notes, 1000)
  const role           = ROLES.includes(body.role) ? body.role : null
  const proofType      = PROOFS.includes(body.proofType) ? body.proofType : null
  const fileType       = typeof body.fileType === 'string' ? body.fileType : ''
  const fileSize       = Number(body.fileSize)
  const restaurantId   = isUuid(body.restaurantId) ? body.restaurantId : null

  if (!restaurantName || !requesterName || !contact || !role || !proofType) {
    return Response.json({ error: 'missing_fields' }, { status: 400 })
  }
  if (!TYPES[fileType]) return Response.json({ error: 'bad_file_type' }, { status: 400 })
  if (!(fileSize > 0) || fileSize > MAX_BYTES) return Response.json({ error: 'file_too_big' }, { status: 400 })

  const db = supabaseAdmin()

  // Light spam limit: at most 3 requests per contact per day
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  const { count } = await db.from('claim_requests').select('id', { count: 'exact', head: true }).eq('contact', contact).gte('created_at', since)
  if ((count ?? 0) >= 3) return Response.json({ error: 'too_many' }, { status: 429 })

  // An approved restaurant already has an owner: ask them to email us instead.
  if (restaurantId) {
    const { data: r } = await db.from('restaurants').select('claim_status').eq('id', restaurantId).maybeSingle()
    if (r?.claim_status === 'approved') return Response.json({ error: 'already_claimed' }, { status: 409 })
  }

  const id = crypto.randomUUID()
  const path = `${id}/proof.${TYPES[fileType]}`
  const { data: signed, error: signErr } = await db.storage.from('claim-proofs').createSignedUploadUrl(path)
  if (signErr || !signed) return Response.json({ error: 'server' }, { status: 500 })

  const { error } = await db.from('claim_requests').insert({
    id, restaurant_id: restaurantId, restaurant_name: restaurantName, requester_name: requesterName,
    requester_role: role, contact, proof_type: proofType, proof_path: path, notes: notes || null,
  })
  if (error) { console.error('claim insert', error); return Response.json({ error: 'server' }, { status: 500 }) }

  return Response.json({ ok: true, id, path, token: signed.token })
}
