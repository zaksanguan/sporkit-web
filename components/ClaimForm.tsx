'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const MAX_BYTES = 10 * 1024 * 1024
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

const ERRORS: Record<string, string> = {
  missing_fields: 'Please fill in every required field.',
  bad_file_type: 'The proof must be a JPG, PNG, WebP or PDF file.',
  file_too_big: 'The proof file must be under 10 MB.',
  too_many: 'Too many requests from this contact today. Please try again tomorrow or email us.',
  already_claimed: 'This restaurant already has a verified owner. Email contact@sporkitapp.com with your proof and we will look into it.',
}

export default function ClaimForm({ restaurantId, restaurantName }: { restaurantId: string | null; restaurantName: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)
    const file = data.get('proof') as File | null
    if (!file || file.size === 0) { setError('Please attach your proof.'); return }
    if (!OK_TYPES.includes(file.type)) { setError(ERRORS.bad_file_type); return }
    if (file.size > MAX_BYTES) { setError(ERRORS.file_too_big); return }

    setBusy(true)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          restaurantName: restaurantId ? restaurantName : data.get('restaurantName'),
          requesterName: data.get('requesterName'),
          role: data.get('role'),
          contact: data.get('contact'),
          proofType: data.get('proofType'),
          notes: data.get('notes'),
          website: data.get('website'),
          fileType: file.type,
          fileSize: file.size,
        }),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) { setError(ERRORS[out.error] ?? 'Something went wrong. Please try again.'); return }
      if (!out.token) { setDone(true); return }  // honeypot hit: pretend success

      const up = await supabase.storage.from('claim-proofs').uploadToSignedUrl(out.path, out.token, file, { contentType: file.type })
      if (up.error) { setError('Upload failed. Please check your connection and try again.'); return }

      await fetch('/api/claim/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: out.id }),
      })
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 48 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true" style={{ marginBottom: 16 }}>
          <circle cx="36" cy="36" r="34" stroke="#1BAF7A" strokeWidth="4" />
          <path d="M22 37l10 10 18-21" stroke="#1BAF7A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 style={{ color: '#FFFFFF' }}>Request received</h2>
        <p>Thank you. We will check your proof and contact you using the details you gave. This can take a few days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Claim your restaurant</h1>
      <p>Send us proof that you own or manage the restaurant. We check every request by hand.</p>
      {restaurantId ? (
        <>
          <label>Restaurant</label>
          <div style={{ background: '#141414', border: '1px solid #262626', borderRadius: 10, padding: '12px 14px', fontSize: 16, color: '#888888' }}>{restaurantName}</div>
        </>
      ) : (
        <>
          <label htmlFor="restaurantName">Restaurant name *</label>
          <input id="restaurantName" name="restaurantName" required maxLength={200} />
        </>
      )}

      <label htmlFor="requesterName">Your name *</label>
      <input id="requesterName" name="requesterName" required maxLength={120} />

      <label htmlFor="role">Your role *</label>
      <select id="role" name="role" required defaultValue="owner">
        <option value="owner">Owner</option>
        <option value="manager">Manager</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="contact">Phone, LINE ID or email *</label>
      <input id="contact" name="contact" required maxLength={200} />

      <label htmlFor="proofType">Proof type *</label>
      <select id="proofType" name="proofType" required defaultValue="utility_bill">
        <option value="utility_bill">Utility bill with your name and the business name</option>
        <option value="business_registration">Business registration or company certificate</option>
        <option value="license">Business or food license</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="proof">Proof file * (JPG, PNG, WebP or PDF, up to 10 MB)</label>
      <input id="proof" name="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required />

      <label htmlFor="notes">Anything else we should know (optional)</label>
      <textarea id="notes" name="notes" rows={3} maxLength={1000} />

      {/* Honeypot: hidden from people, bots fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />

      <p className="privacy">
        We use your document only to check that you own or manage this restaurant. It is stored privately, never shown to anyone, and deleted after review.
      </p>

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Submitting...' : 'Submit claim'}</button>
    </form>
  )
}
