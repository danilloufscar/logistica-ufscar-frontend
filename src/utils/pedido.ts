import { format, isValid, parseISO } from 'date-fns'
import type { StatusExibido, StatusPedido } from '@/types/pedido'

export const ROTULO_STATUS: Record<StatusExibido, string> = {
  CRIADO: 'Criado',
  EM_SEPARACAO: 'Em separação',
  DESPACHADO: 'Despachado',
  EM_TRANSITO: 'Em trânsito',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
  ATRASADO: 'Atrasado',
}

/** RN01: etapas do pedido, na ordem. Cancelado fica fora do fluxo. */
export const FLUXO_STATUS: readonly StatusPedido[] = ['CRIADO', 'EM_SEPARACAO', 'DESPACHADO', 'EM_TRANSITO', 'ENTREGUE']

/** Opções do filtro, na ordem do fluxo do pedido. */
export const FILTROS_STATUS: readonly StatusExibido[] = [...FLUXO_STATUS, 'CANCELADO', 'ATRASADO']

export function statusConhecido(valor: string): valor is StatusExibido {
  return Object.hasOwn(ROTULO_STATUS, valor)
}

/** RN01: próxima etapa, ou `undefined` para Entregue e Cancelado. A API confirma a regra. */
export function proximoStatus(status: StatusPedido): StatusPedido | undefined {
  const indice = FLUXO_STATUS.indexOf(status)
  return indice >= 0 ? FLUXO_STATUS[indice + 1] : undefined
}

/** RN02: edição e cancelamento só em Criado ou Em separação. A API confirma a regra. */
export function permiteAlteracao(status: StatusPedido): boolean {
  return status === 'CRIADO' || status === 'EM_SEPARACAO'
}

/** Id do pedido a partir do parâmetro da rota, ou `null` se não for um inteiro positivo. */
export function idDePedido(parametro: string | undefined): number | null {
  const id = Number(parametro)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

/** Data de hoje (AAAA-MM-DD) no calendário de São Paulo, o mesmo que a API usa para prazos. */
export function hojeEmSaoPaulo(): string {
  // O formato en-CA é AAAA-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

/** Formata uma data AAAA-MM-DD como DD/MM/AAAA, sem conversão de fuso. */
export function formatarData(data: string): string {
  const valor = parseISO(data)
  return isValid(valor) ? format(valor, 'dd/MM/yyyy') : data
}

/** Formata um instante ISO 8601 como DD/MM/AAAA HH:mm no horário local. */
export function formatarDataHora(dataHora: string): string {
  const valor = parseISO(dataHora)
  return isValid(valor) ? format(valor, 'dd/MM/yyyy HH:mm') : dataHora
}
