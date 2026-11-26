// Run once on YOUR computer: node scripts/admin-setup.mjs
// Prints the values to paste into Vercel (Settings > Environment Variables). Nothing is saved or sent anywhere.
import { randomBytes } from 'node:crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
function base32(buf) {
  let bits = 0, value = 0, out = ''
  for (const b of buf) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) { out += ALPHABET[(value >>> (bits - 5)) & 31]; bits -= 5 }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31]
  return out
}
const password = randomBytes(18).toString('base64url')   // 24 characters
const totp = base32(randomBytes(20))                       // 32 characters
const session = randomBytes(32).toString('hex')            // 64 characters

console.log('\nSave all four in your password manager first, then add them in Vercel:\n')
console.log('ADMIN_USERNAME=<pick a username, not "admin">')
console.log('ADMIN_PASSWORD=' + password)
console.log('ADMIN_TOTP_SECRET=' + totp)
console.log('ADMIN_SESSION_SECRET=' + session)
console.log('\nGoogle Authenticator: "+" > "Enter a setup key" > account name "SporkIt Admin" > key = the ADMIN_TOTP_SECRET above > type "Time based" > Add.\n')
