import { jwtVerify } from 'jose'

// Chave secreta para assinar os tokens JWT (em produção, use variáveis de ambiente)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
)

export interface JWTPayload {
  id: string
  name: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// Função para verificar um token JWT
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    throw new Error('Token inválido ou expirado')
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const [, payload] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    return decodedPayload as JWTPayload
  } catch {
    return null
  }
}

// Função para verificar se um token está expirado
export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    const exp = decodedPayload.exp

    if (!exp) return true

    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}
