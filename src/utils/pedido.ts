import { format, isValid, parseISO } from 'date-fns'
import type { StatusExibido } from '@/types/pedido'

export const ROTULO_STATUS: Record<StatusExibido, string> = {
  CRIADO: 'Criado',
  EM_SEPARACAO: 'Em separação',
  DESPACHADO: 'Despachado',
  EM_TRANSITO: 'Em trânsito',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
  ATRASADO: 'Atrasado',
}

/** Opções do filtro, na ordem do fluxo do pedido. */
export const FILTROS_STATUS: readonly StatusExibido[] = [
  'CRIADO', 'EM_SEPARACAO', 'DESPACHADO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO', 'ATRASADO',
]

export function statusConhecido(valor: string): valor is StatusExibido {
  return Object.hasOwn(ROTULO_STATUS, valor)
}

/** Formata uma data AAAA-MM-DD como DD/MM/AAAA, sem conversão de fuso. */
export function formatarData(data: string): string {
  const valor = parseISO(data)
  return isValid(valor) ? format(valor, 'dd/MM/yyyy') : data
}
