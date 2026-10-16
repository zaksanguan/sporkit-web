import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

// Step 2: the browser finished uploading the proof. Check the file really exists, then email Zak.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const id = body?.id
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ error: 'bad_request' }, { status: 400 })

  const db = supabaseAdmin()
  const { data: row } = await db.from('claim_requests').select('*').eq('id', id).maybeSingle()
  if (!row) return Response.json({ error: 'not_found' }, { status: 404 })

  const { data: files } = await db.storage.from('claim-proofs').list(id)
  if (!files || files.length === 0) return Response.json({ error: 'no_file' }, { status: 400 })

  // Private file: a signed link that works for 24 hours, sent only to Zak
  const { data: link } = await db.storage.from('claim-proofs').createSignedUrl(row.proof_path, 24 * 3600)

  const key = process.env.RESEND_API_KEY
  const to = process.env.CLAIM_ALERT_TO
  const from = process.env.CLAIM_ALERT_FROM
  if (key && to && from) {
    const text = [
      'New restaurant claim request on SporkIt', '',
      `Restaurant: ${row.restaurant_name}`,
      `Restaurant id: ${row.restaurant_id ?? '(not linked)'}`,
      `From: ${row.requester_name} (${row.requester_role})`,
      `Contact: ${row.contact}`,
      `Proof type: ${row.proof_type}`,
      `Notes: ${row.notes ?? '-'}`,
      `Request id: ${row.id}`, '',
      `Proof file (link works for 24 hours): ${link?.signedUrl ?? '(could not create link)'}`,
      `Stored at: Supabase > Storage > claim-proofs > ${row.proof_path}`,
      'Review it in Supabase > Table Editor > claim_requests.',
    ].join('\n')
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject: `SporkIt claim: ${row.restaurant_name}`, text }),
    })
    if (!res.ok) console.error('claim alert email failed', res.status, await res.text())
  }
  return Response.json({ ok: true })
}
