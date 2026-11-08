import styled from 'styled-components'
import { cartao, ocultoVisualmente } from '@/components/ui'

export const ListCard = styled.div`
  ${cartao}
  padding: 4px 12px;
`

export const Status = styled.div`
  padding: 28px 12px;
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; }
  p { margin-top: 8px; line-height: 1.6; color: ${({ theme }) => theme.colors.textoSecundario}; }
  button { margin-top: 16px; }
`

export const Aviso = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 4px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.obrigatorio};
  border-radius: ${({ theme }) => theme.radius.campo};
  color: ${({ theme }) => theme.colors.obrigatorio};
  line-height: 1.5;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  caption { ${ocultoVisualmente} }
  thead th {
    padding: 14px 12px 10px;
    text-align: left;
    font-size: ${({ theme }) => theme.font.grupoMenu.size};
    font-weight: ${({ theme }) => theme.font.grupoMenu.weight};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.textoSecundario};
  }
  tbody th, td {
    padding: 14px 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.linhaTabela};
    text-align: left;
    vertical-align: middle;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
  tbody th { font-weight: ${({ theme }) => theme.font.textoForte.weight}; }
  tbody tr[data-alerta] {
    background: color-mix(in srgb, ${({ theme }) => theme.status.ATRASADO.fundo} 45%, ${({ theme }) => theme.colors.branco});
  }
  [data-alinhamento='direita'] { text-align: right; font-variant-numeric: tabular-nums; }
  [data-quebra='nunca'] { white-space: nowrap; }

  @media (max-width: 600px) {
    display: block;
    thead { ${ocultoVisualmente} }
    tbody { display: block; }
    tbody tr { display: grid; gap: 6px; padding: 14px 0; border-top: 1px solid ${({ theme }) => theme.colors.linhaTabela}; }
    tbody tr:first-child { border-top: 0; }
    tbody tr[data-alerta] { padding-inline: 8px; border-radius: ${({ theme }) => theme.radius.campo}; }
    tbody th, td {
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      align-items: center;
      gap: 12px;
      padding: 0;
      border: 0;
      white-space: normal;
    }
    [data-alinhamento='direita'] { text-align: left; }
    tbody th::before, td::before {
      content: attr(data-label);
      font-size: ${({ theme }) => theme.font.legenda.size};
      font-weight: ${({ theme }) => theme.font.legenda.weight};
      color: ${({ theme }) => theme.colors.textoSecundario};
    }
  }
`

export const Rodape = styled.p`
  padding: 12px 12px 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.linhaTabela};
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
`
