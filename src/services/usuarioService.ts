import axios from 'axios'
import { api, mensagemDeErro } from './api'
import type { Usuario } from '@/types/auth'
import type { CadastroUsuario, CampoCadastroUsuario } from '@/types/usuario'

export async function listarUsuarios(signal: AbortSignal): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>('/usuarios', { signal })
  if (!Array.isArray(data)) throw new Error('Resposta de usuários inválida')
  return data
}

export async function cadastrarUsuario(dados: CadastroUsuario, signal: AbortSignal): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/usuarios', dados, { signal })
  return data
}

export function erroDeCadastro(erro: unknown): {
  mensagem: string
  campos: Partial<Record<CampoCadastroUsuario, string>>
} {
  const campos: Partial<Record<CampoCadastroUsuario, string>> = {}
  const mensagem = mensagemDeErro(erro, 'Não foi possível cadastrar o usuário.')
  if (!axios.isAxiosError(erro)) return { mensagem, campos }
  if (!erro.response) {
    return { mensagem: 'Não foi possível confirmar o cadastro. Confira a lista antes de tentar novamente.', campos }
  }
  const corpo = erro.response.data as { codigo?: unknown; detalhes?: unknown } | undefined
  if (erro.response.status === 409 && corpo?.codigo === 'EMAIL_JA_CADASTRADO') {
    campos.email = 'Este e-mail já está cadastrado.'
  }
  if (erro.response.status === 400 && corpo?.detalhes && typeof corpo.detalhes === 'object') {
    const detalhes = corpo.detalhes as Record<string, unknown>
    for (const campo of ['nome', 'email', 'senha', 'perfil'] as const) {
      if (typeof detalhes[campo] === 'string') campos[campo] = detalhes[campo]
    }
  }
  return { mensagem, campos }
}
