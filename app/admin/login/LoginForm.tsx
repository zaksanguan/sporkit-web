'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '../actions'

const ALERT = 'M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72M120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12'

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})
  return (
    <form action={action} className="card">
      {state.error ? (
        <div className="err" role="alert">
          <svg viewBox="0 0 256 256" aria-hidden="true"><path d={ALERT} /></svg>
          <span>{state.error}</span>
        </div>
      ) : null}
      <label className="field">
        <span>Username</span>
        <input name="username" autoComplete="username" required autoFocus />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <label className="field">
        <span>Authenticator code</span>
        <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required />
      </label>
      <button className="go-btn" type="submit" disabled={pending}>{pending ? 'Checking...' : 'Sign in'}</button>
    </form>
  )
}
