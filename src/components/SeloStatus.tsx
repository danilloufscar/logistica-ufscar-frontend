import styled from 'styled-components'
import type { StatusExibido } from '@/types/pedido'
import { ROTULO_STATUS, statusConhecido } from '@/utils/pedido'

const Selo = styled.span<{ $status: StatusExibido }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.pilula};
  font-size: ${({ theme }) => theme.font.legenda.size};
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  color: ${({ theme, $status }) => theme.status[$status].texto};
  background: ${({ theme, $status }) => theme.status[$status].fundo};
`

/** Selo colorido de status. Um valor desconhecido vindo da API aparece como texto neutro. */
export function SeloStatus({ status }: { status: string }) {
  if (!statusConhecido(status)) return <Selo $status="CRIADO">{status}</Selo>
  return <Selo $status={status}>{ROTULO_STATUS[status]}</Selo>
}
