import { api } from './api'
import type { ResumoPedido } from '@/types/pedido'

export async function listarPedidos(signal: AbortSignal): Promise<ResumoPedido[]> {
  const { data } = await api.get<ResumoPedido[]>('/pedidos', { signal })
  if (!Array.isArray(data)) throw new Error('Resposta de pedidos inválida')
  return data
}
