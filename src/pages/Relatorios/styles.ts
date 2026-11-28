import styled from 'styled-components'
import { cartao, ocultoVisualmente } from '@/components/ui'

export const Filtros = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
  margin: 24px 0;
  > div { flex: 1 1 180px; }
`
export const Indicadores = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
  margin-top: 20px;
`
export const Card = styled.section`
  ${cartao}
  padding: 20px;
  h2 { font-size: 1.15rem; margin-bottom: 12px; }
  p { line-height: 1.6; margin: 8px 0; }
`
export const Percentual = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
`

export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  caption { ${ocultoVisualmente} }
  th, td { padding: 12px 4px; border-bottom: 1px solid ${({ theme }) => theme.colors.borda}; }
  th { text-align: left; }
  td, thead th:last-child { text-align: right; }
  tbody th { font-weight: 400; }
  tfoot { font-weight: 700; }
`
