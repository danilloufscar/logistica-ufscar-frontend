import axios from 'axios'
import { api, interpretarErroDeCadastro } from './api'
import type { StatusPedido } from '@/types/pedido'

export const TIPOS_OCORRENCIA = {
  ATRASO: 'Atraso', AVARIA: 'Avaria', DESTINATARIO_AUSENTE: 'Destinatário ausente',
} as const
export interface DadosOcorrencia {
  tipo: keyof typeof TIPOS_OCORRENCIA
  descricao: string
  data: string
}
export interface Ocorrencia {
  tipo: 'OCORRENCIA'
  dataHora: string
  dataOcorrencia: string
  usuario: { id: number; nome: string }
  tipoOcorrencia: DadosOcorrencia['tipo']
  descricao: string
}


export async function registrarOcorrencia(id: number, dados: DadosOcorrencia, signal: AbortSignal): Promise<Ocorrencia> {
  const { data } = await api.post<Ocorrencia>(`/pedidos/${id}/ocorrencias`, dados, { signal })
  return data
}

export function erroDeOcorrencia(erro: unknown) {
  const campos: readonly (keyof DadosOcorrencia)[] = ['tipo', 'descricao', 'data']
  const resultado = interpretarErroDeCadastro(erro, campos, 'Não foi possível registrar a ocorrência.')
  if (axios.isAxiosError(erro) && !erro.response) {
    resultado.mensagem = 'Não foi possível confirmar o registro. Atualize as ocorrências antes de enviar novamente.'
  }
  return resultado
}

/** Evento de `GET /api/pedidos/{id}/timeline` (RF13), em ordem cronológica. */
export interface EventoTimeline {
  tipo: 'STATUS' | 'OCORRENCIA'
  dataHora: string
  dataOcorrencia: string | null
  usuario: { id: number; nome: string }
  status: StatusPedido | null
  statusRotulo: string | null
  tipoOcorrencia: DadosOcorrencia['tipo'] | null
  tipoOcorrenciaRotulo: string | null
  descricao: string
}
export async function buscarTimeline(id: number, signal: AbortSignal): Promise<EventoTimeline[]> {
  const { data } = await api.get<EventoTimeline[]>(`/pedidos/${id}/timeline`, { signal })
  return data
}
