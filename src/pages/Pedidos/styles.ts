import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { cartao } from '@/components/ui'

/* Cabeçalho comum: trilha, título e ações à direita. */

export const Cabecalho = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`

export const Trilha = styled.nav`
  margin-bottom: 4px;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
  a { color: inherit; text-decoration: none; }
  a:hover { color: ${({ theme }) => theme.colors.destaque}; text-decoration: underline; }
`

export const Titulo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Estado = styled.div`
  ${cartao}
  margin-top: 24px;
  padding: 28px 24px;
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; }
  p { margin-top: 8px; line-height: 1.6; color: ${({ theme }) => theme.colors.textoSecundario}; }
  > a, > button { margin-top: 16px; margin-right: 8px; }
`

/* Lista */

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

export const LinkDetalhes = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  &:hover { text-decoration: underline; }
`

/* Formulário */

export const FormCard = styled.div`
  ${cartao}
  max-width: 760px;
  margin-top: 24px;
  padding: 24px;
  @media (max-width: 600px) { padding: 20px; }
`

export const Form = styled.form`
  display: grid;
  gap: 20px;
  > fieldset { border: 0; padding: 0; margin: 0; min-width: 0; display: grid; gap: 20px; }
  > fieldset:disabled { opacity: 0.7; }
`

export const Linha = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`

export const Itens = styled.fieldset`
  display: grid;
  gap: 16px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  legend { padding: 0; margin-bottom: 12px; font-weight: ${({ theme }) => theme.font.textoForte.weight}; }
  > button:last-child { justify-self: start; }
`

export const LinhaItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 136px auto;
  align-items: start;
  gap: 12px;
  > button { margin-top: 26px; }
  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr) 112px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.linhaTabela};
    > button { grid-column: 1 / -1; justify-self: start; margin-top: -8px; }
  }
`

export const Obrigatorio = styled.span`
  color: ${({ theme }) => theme.colors.obrigatorio};
`

export const Rodape = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.borda};
  p {
    flex: 1 1 280px;
    max-width: 420px;
    font-size: ${({ theme }) => theme.font.legenda.size};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textoSecundario};
  }
`

/* Detalhe */

export const LayoutDetalhe = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  align-items: start;
  gap: 20px;
  margin-top: 24px;
  @media (max-width: 1000px) { grid-template-columns: minmax(0, 1fr); }
`

export const Coluna = styled.div`
  display: grid;
  gap: 20px;
  min-width: 0;
`

export const Cartao = styled.section`
  ${cartao}
  padding: 20px;
  h2 { margin-bottom: 16px; font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; }
  /* Alinha o texto das células ao título; no celular a tabela vira cartões sem esse recuo. */
  @media (min-width: 601px) { table { width: calc(100% + 24px); margin: -8px -12px 0; } }
`

export const Dados = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
  margin: 0;
  dt {
    font-size: ${({ theme }) => theme.font.grupoMenu.size};
    font-weight: ${({ theme }) => theme.font.grupoMenu.weight};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textoSecundario};
  }
  dd { margin: 4px 0 0; line-height: 1.5; overflow-wrap: anywhere; }
  @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`

export const Codigo = styled.strong`
  letter-spacing: 0.04em;
`

export const LinhaDoTempo = styled.ol`
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  li { display: grid; grid-template-columns: 10px minmax(0, 1fr); gap: 12px; }
  strong { display: block; font-weight: ${({ theme }) => theme.font.textoForte.weight}; }
  li > div > span { display: block; margin-top: 2px; font-size: ${({ theme }) => theme.font.legenda.size}; color: ${({ theme }) => theme.colors.textoSecundario}; }
  li[data-situacao='pendente'] strong { font-weight: 500; color: ${({ theme }) => theme.colors.textoSecundario}; }
`

export const Marcador = styled.span<{ $situacao: 'concluido' | 'cancelado' | 'proximo' | 'pendente' }>`
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme, $situacao }) =>
    $situacao === 'concluido' ? theme.colors.destaque : $situacao === 'cancelado' ? theme.colors.obrigatorio : theme.colors.bordaCampo};
  background: ${({ theme, $situacao }) =>
    $situacao === 'concluido' ? theme.colors.destaque : $situacao === 'cancelado' ? theme.colors.obrigatorio : theme.colors.branco};
`
