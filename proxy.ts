import { NextRequest, NextResponse } from 'next/server'

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const authToken = req.cookies.get('auth-token')?.value
  const loggedIn = !!authToken

  if (pathname.startsWith('/admin') && !loggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/login') && loggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
