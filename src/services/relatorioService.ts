import { api } from './api'
import type { StatusPedido } from '@/types/pedido'

export interface PeriodoRelatorio { inicio: string; fim: string }
export interface RelatorioDesempenho extends PeriodoRelatorio {
  pedidosPorStatus: { status: Exclude<StatusPedido, 'CANCELADO'>; rotulo: string; quantidade: number }[]
  totalPedidos: number
  entregasNoPeriodo: number
  entregasNoPrazo: number
  percentualNoPrazo: number | null
  tempoMedioEntregaDias: number | null
}

export async function buscarRelatorio(periodo: PeriodoRelatorio, signal: AbortSignal): Promise<RelatorioDesempenho> {
  const { data } = await api.get<RelatorioDesempenho>('/relatorios/desempenho', { params: periodo, signal })
  return data
}
