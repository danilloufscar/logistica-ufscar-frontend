import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { cartao } from '@/components/ui'

export const Cabecalho = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
`

export const Atualizacao = styled.p<{ $falhou: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme, $falhou }) => ($falhou ? theme.colors.obrigatorio : theme.status.ENTREGUE.texto)};
  }
`

export const Abas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 24px;
`

export const Aba = styled.button`
  min-height: 36px;
  padding: 6px 16px;
  border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
  border-radius: ${({ theme }) => theme.radius.pilula};
  background: ${({ theme }) => theme.colors.branco};
  color: ${({ theme }) => theme.colors.texto};
  font-weight: 600;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.fundoHover}; }
  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.destaque};
    background: ${({ theme }) => theme.colors.destaque};
    color: ${({ theme }) => theme.colors.branco};
  }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
  gap: 24px;
  @media (max-width: 1000px) { grid-template-columns: minmax(0, 1fr); }
`

export const ListaCard = styled.div`
  ${cartao}
  padding: 4px 12px;
  tbody tr { cursor: pointer; }
  tbody tr:hover:not([data-alerta]) { background: ${({ theme }) => theme.colors.fundoHover}; }
  @media (min-width: 601px) {
    tbody tr[data-selecionado] > :first-child { box-shadow: inset 3px 0 0 ${({ theme }) => theme.colors.destaque}; }
  }
  /* No celular a linha vira um cartão: a marca acompanha o cartão inteiro. */
  @media (max-width: 600px) {
    tbody tr[data-selecionado] { padding-inline: 8px; border-radius: ${({ theme }) => theme.radius.campo}; box-shadow: inset 3px 0 0 ${({ theme }) => theme.colors.destaque}; }
  }
`

export const Estado = styled.div`
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

/** Seleciona a linha pelo teclado; o clique na linha inteira é só um atalho para o mouse. */
export const BotaoPedido = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: ${({ theme }) => theme.font.textoForte.weight};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.destaque}; text-decoration: underline; }
`

export const Selos = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Prazo = styled.span<{ $atrasado: boolean }>`
  white-space: nowrap;
  ${({ theme, $atrasado }) => $atrasado && `color: ${theme.status.ATRASADO.texto}; font-weight: ${theme.font.textoForte.weight};`}
`

export const Painel = styled.section`
  ${cartao}
  padding: 24px;
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; }
`

export const LinkPedido = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover { color: ${({ theme }) => theme.colors.destaque}; text-decoration: underline; }
`

export const Subtitulo = styled.p`
  margin: 4px 0 20px;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
`

export const AcoesPainel = styled.div`
  display: grid;
  justify-items: start;
  gap: 12px;
  margin-top: 24px;
`

export const Falta = styled.div`
  margin-top: 16px;
  font-size: ${({ theme }) => theme.font.rotulo.size};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.obrigatorio};
  ul { margin: 6px 0 0 18px; }
`
