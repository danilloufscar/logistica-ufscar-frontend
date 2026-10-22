import { jwtDecode } from 'jwt-decode'
import type { Perfil, Usuario } from '@/types/auth'
import { api } from './api'

interface RespostaLogin {
  token: string
}

/** Dados esperados no JWT (proposta, combinar com o back-end). */
interface ClaimsToken {
  sub: string
  id?: number
  nome?: string
  perfil: Perfil
  exp?: number
}

export function usuarioDoToken(token: string): Usuario | null {
  try {
    const claims = jwtDecode<ClaimsToken>(token)
    if (claims.exp && claims.exp * 1000 < Date.now()) return null
    return { id: claims.id ?? 0, nome: claims.nome ?? claims.sub, email: claims.sub, perfil: claims.perfil }
  } catch {
    return null
  }
}

export async function login(email: string, senha: string): Promise<string> {
  const { data } = await api.post<RespostaLogin>('/auth/login', { email, senha })
  return data.token
}
