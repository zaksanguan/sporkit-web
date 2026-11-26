import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLogo from '../AdminLogo'
import LoginForm from './LoginForm'
import { ADMIN_COOKIE, readAdminEnv, verifySessionToken } from '../../../lib/admin/session'

export default async function AdminLoginPage() {
  // Already signed in: go straight to the dashboard.
  const env = readAdminEnv()
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (env && verifySessionToken(token, env)) redirect('/admin')
  return (
    <div className="login">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
        <AdminLogo />
      </div>
      <LoginForm />
    </div>
  )
}
