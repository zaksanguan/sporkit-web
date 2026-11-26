import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Quick, optimistic check only: no admin cookie, no admin page. The real check (signature, expiry) runs in
// requireAdmin() inside every admin page and action.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !request.cookies.get('sporkit_admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  const res = NextResponse.next()
  if (pathname.startsWith('/admin')) res.headers.set('Cache-Control', 'no-store')
  return res
}

export const config = { matcher: '/admin/:path*' }
