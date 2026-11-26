import { createHmac, timingSafeEqual } from 'node:crypto'

// Time-based one-time codes (RFC 6238): the 6-digit code Google Authenticator shows. No dependencies.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Decode(input: string): Buffer {
  const clean = input.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase()
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const ch of clean) {
    const idx = ALPHABET.indexOf(ch)
    if (idx === -1) throw new Error('Invalid base32 character')
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

export function hotp(key: Buffer, counter: number, digits = 6): string {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const h = createHmac('sha1', key).update(buf).digest()
  const o = h[h.length - 1] & 0x0f
  const bin = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]
  return String(bin % 10 ** digits).padStart(digits, '0')
}

// Returns the 30-second step the code belongs to, or null when it does not match.
// Accepts the previous, current and next step (phone clocks drift a little).
export function verifyTotp(code: string, secretBase32: string, nowMs = Date.now()): number | null {
  if (!/^\d{6}$/.test(code)) return null
  const key = base32Decode(secretBase32)
  const step = Math.floor(nowMs / 1000 / 30)
  const given = Buffer.from(code)
  let match: number | null = null
  for (const s of [step - 1, step, step + 1]) {
    const expected = Buffer.from(hotp(key, s))
    if (timingSafeEqual(given, expected)) match = s
  }
  return match
}
