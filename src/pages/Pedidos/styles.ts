import styled from 'styled-components'
import { cartao } from '@/components/ui'

export const Filtros = styled.div`
  ${cartao}
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: end;
  gap: 16px;
  margin: 24px 0 20px;
  padding: 16px 20px 20px;
  @media (max-width: 700px) { grid-template-columns: minmax(0, 1fr); }
`

export const Selos = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Prazo = styled.span<{ $atrasado: boolean }>`
  ${({ theme, $atrasado }) => $atrasado && `color: ${theme.status.ATRASADO.texto}; font-weight: ${theme.font.textoForte.weight};`}
`
