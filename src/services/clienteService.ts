import { api, interpretarErroDeCadastro } from './api'
import type { CadastroCliente, CampoCadastroCliente, Cliente } from '@/types/cliente'

const CAMPOS: readonly CampoCadastroCliente[] = ['nome', 'telefone', 'endereco']

export async function listarClientes(signal: AbortSignal): Promise<Cliente[]> {
  const { data } = await api.get<Cliente[]>('/clientes', { signal })
  if (!Array.isArray(data)) throw new Error('Resposta de clientes inválida')
  return data
}

export async function cadastrarCliente(dados: CadastroCliente, signal: AbortSignal): Promise<Cliente> {
  const { data } = await api.post<Cliente>('/clientes', dados, { signal })
  return data
}

export function erroDeCadastroCliente(erro: unknown) {
  return interpretarErroDeCadastro(erro, CAMPOS, 'Não foi possível cadastrar o cliente.')
}
