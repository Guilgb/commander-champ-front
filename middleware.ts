import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import Cookies from "js-cookie";


// Rotas que requerem autenticação
const protectedRoutes = [
  '/profile',
  '/articles/create',
  '/articles/edit',
  '/admin',
  '/tournaments/register',
]

// Rotas que requerem roles específicas
const roleRestrictedRoutes = [
  { path: '/admin', roles: ['ADMIN'] },
  { path: '/articles/create', roles: ['EDITOR', 'ADMIN'] },
  { path: '/articles/edit', roles: ['EDITOR', 'ADMIN'] },
  { path: '/tournaments/register', roles: ['TOURNAMENT_ADMIN', 'ADMIN'] },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const token = Cookies.get('auth_token') || request.cookies.get('auth_token')?.value

  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  try {
    const payload = await verifyToken(token)
    const restrictedRoute = roleRestrictedRoutes.find(route =>
      pathname === route.path || pathname.startsWith(`${route.path}/`)
    )

    if (restrictedRoute && !restrictedRoute.roles.includes(payload.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Token verification failed:', error)
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/articles/create/:path*',
    '/articles/edit/:path*',
    '/admin/:path*',
    '/tournaments/register/:path*',
  ],
}
