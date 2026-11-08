import { api, interpretarErroDeCadastro } from './api'
import type { Usuario } from '@/types/auth'
import type { CadastroUsuario, CampoCadastroUsuario } from '@/types/usuario'

const CAMPOS: readonly CampoCadastroUsuario[] = ['nome', 'email', 'senha', 'perfil']

export async function listarUsuarios(signal: AbortSignal): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>('/usuarios', { signal })
  if (!Array.isArray(data)) throw new Error('Resposta de usuários inválida')
  return data
}

export async function cadastrarUsuario(dados: CadastroUsuario, signal: AbortSignal): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/usuarios', dados, { signal })
  return data
}

export function erroDeCadastro(erro: unknown) {
  return interpretarErroDeCadastro(erro, CAMPOS, 'Não foi possível cadastrar o usuário.', {
    codigo: 'EMAIL_JA_CADASTRADO', campo: 'email', mensagem: 'Este e-mail já está cadastrado.',
  })
}
