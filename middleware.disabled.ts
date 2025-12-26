import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Admin Area"' },
  })
}

export function middleware(request: NextRequest) {
  // Only protect /admin
  if (!request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()

  const validUser = process.env.BASIC_AUTH_USER
  const validPass = process.env.BASIC_AUTH_PASS

  // Fail closed if env vars are missing
  if (!validUser || !validPass) return unauthorized()

  const authHeader = request.headers.get('authorization')
  if (!authHeader) return unauthorized()

  const [scheme, encoded] = authHeader.split(' ')
  if (scheme !== 'Basic' || !encoded) return unauthorized()

  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return unauthorized()
  }

  const idx = decoded.indexOf(':')
  if (idx === -1) return unauthorized()

  const user = decoded.slice(0, idx)
  const pass = decoded.slice(idx + 1)

  if (user === validUser && pass === validPass) return NextResponse.next()

  return unauthorized()
}

export const config = {
  matcher: ['/admin/:path*'],
}
