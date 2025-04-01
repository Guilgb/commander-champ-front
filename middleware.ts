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
  // Verificar se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Obter o token do cookie
  const token = Cookies.get('auth_token') || request.cookies.get('auth_token')?.value
  // Se não houver token, redirecionar para a página de login
  
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  try {
    // Verificar o token
    const payload = await verifyToken(token)
    // Verificar se a rota requer roles específicas
    const restrictedRoute = roleRestrictedRoutes.find(route =>
      pathname === route.path || pathname.startsWith(`${route.path}/`)
    )

    if (restrictedRoute && !restrictedRoute.roles.includes(payload.role)) {
      // Usuário não tem permissão para acessar esta rota
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Token válido e usuário tem permissão, continuar
    return NextResponse.next()
  } catch (error) {
    // Token inválido, redirecionar para login
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
