import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If in DEV mode (Preview/Local Dev), bypass Basic Auth
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    return NextResponse.next()
  }

  // Protect /admin routes in Production
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')

    if (authHeader) {
      // Decode the Base64 Basic Auth header
      const authValue = authHeader.split(' ')[1]
      try {
        const [user, pwd] = atob(authValue).split(':')

        // Check against environment variables
        const validUser = process.env.BASIC_AUTH_USER
        const validPass = process.env.BASIC_AUTH_PASS

        if (validUser && validPass && user === validUser && pwd === validPass) {
          return NextResponse.next()
        }
      } catch (e) {
        // malformed header, fall through to 401
      }
    }

    // Fail: Prompt for Basic Auth
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    })
  }

  return NextResponse.next()
}

// Only run on admin routes
export const config = {
  matcher: '/admin/:path*',
}
