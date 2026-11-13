import { api, interpretarErroDeCadastro } from './api'
import axios from 'axios'
import type { ItemSemEstoque } from '@/types/pedido'
import type { CampoPedido, DadosPedido, Pedido, ResumoPedido, StatusPedido } from '@/types/pedido'

export async function listarPedidos(signal: AbortSignal): Promise<ResumoPedido[]> {
  const { data } = await api.get<ResumoPedido[]>('/pedidos', { signal })
  if (!Array.isArray(data)) throw new Error('Resposta de pedidos inválida')
  return data
}

export async function buscarPedido(id: number, signal: AbortSignal): Promise<Pedido> {
  const { data } = await api.get<Pedido>(`/pedidos/${id}`, { signal })
  return data
}

export async function criarPedido(dados: DadosPedido, signal: AbortSignal): Promise<Pedido> {
  const { data } = await api.post<Pedido>('/pedidos', dados, { signal })
  return data
}

export async function editarPedido(id: number, dados: DadosPedido, signal: AbortSignal): Promise<Pedido> {
  const { data } = await api.put<Pedido>(`/pedidos/${id}`, dados, { signal })
  return data
}

export async function cancelarPedido(id: number, signal: AbortSignal): Promise<Pedido> {
  const { data } = await api.post<Pedido>(`/pedidos/${id}/cancelar`, undefined, { signal })
  return data
}

/** Envia o status que o usuário estava vendo; se o pedido já mudou, a API recusa em vez de pular uma etapa. */
export async function avancarPedido(id: number, statusAtual: StatusPedido, signal: AbortSignal): Promise<Pedido> {
  const { data } = await api.post<Pedido>(`/pedidos/${id}/avancar`, { statusAtual }, { signal })
  return data
}

const CAMPO_PEDIDO = /^(clienteId|prazoEntrega|enderecoEntrega|itens|itens\.\d+\.(produtoId|quantidade))$/

export function itensSemEstoque(erro: unknown): ItemSemEstoque[] | null {
  if (!axios.isAxiosError(erro) || erro.response?.status !== 409) return null
  const corpo = erro.response.data as { codigo?: string; itens?: ItemSemEstoque[] }
  return corpo?.codigo === 'ESTOQUE_INSUFICIENTE' && Array.isArray(corpo.itens) ? corpo.itens : null
}

/** Converte as chaves de erro da API (`itens[1].quantidade`) nos nomes dos campos do formulário (`itens.1.quantidade`). */
export function erroDeFormularioPedido(erro: unknown) {
  return interpretarErroDeCadastro<CampoPedido>(erro, (chave) => {
    const campo = chave.replace(/\[(\d+)\]/g, '.$1')
    return CAMPO_PEDIDO.test(campo) ? campo as CampoPedido : undefined
  }, 'Não foi possível salvar o pedido.')
}
