import { jwtDecode } from 'jwt-decode'
import type { Usuario } from '@/types/auth'
import { api } from './api'

interface RespostaLogin {
  token: string
}

/** Dados do contrato JWT do backend; a assinatura é validada pelo servidor. */
interface ClaimsToken {
  sub?: unknown
  id?: unknown
  nome?: unknown
  perfil?: unknown
  exp?: unknown
}

export interface Sessao {
  usuario: Usuario
  expiraEm: number
}

export function sessaoDoToken(token: string): Sessao | null {
  try {
    const claims = jwtDecode<ClaimsToken>(token)
    if (typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) return null
    if (typeof claims.sub !== 'string' || !claims.sub.trim()) return null
    if (typeof claims.nome !== 'string' || !claims.nome.trim()) return null
    if (typeof claims.id !== 'number' || !Number.isSafeInteger(claims.id) || claims.id <= 0) return null
    if (claims.perfil !== 'ADMINISTRADOR' && claims.perfil !== 'OPERADOR') return null
    return {
      usuario: { id: claims.id, nome: claims.nome, email: claims.sub, perfil: claims.perfil },
      expiraEm: claims.exp * 1000,
    }
  } catch {
    return null
  }
}

export async function login(email: string, senha: string): Promise<string> {
  const { data } = await api.post<RespostaLogin>('/auth/login', { email, senha })
  return data.token
}
