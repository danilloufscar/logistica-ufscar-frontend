import styled, { type DefaultTheme } from 'styled-components'
import type { SituacaoEtapa } from '.'

export const Lista = styled.ol`
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
  li { display: grid; grid-template-columns: 10px minmax(0, 1fr); gap: 12px; }
  strong { display: block; font-weight: ${({ theme }) => theme.font.textoForte.weight}; line-height: 1.4; }
  li[data-situacao='pendente'] strong, li[data-situacao='proximo'] strong {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textoSecundario};
  }
`

export const Detalhe = styled.span`
  display: block;
  margin-top: 2px;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
`

export const Descricao = styled.p`
  margin-top: 4px;
  font-size: ${({ theme }) => theme.font.rotulo.size};
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const Marcador = styled.span<{ $situacao: SituacaoEtapa }>`
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme, $situacao }) => corDoMarcador(theme, $situacao)};
  background: ${({ theme, $situacao }) =>
    $situacao === 'pendente' || $situacao === 'proximo' ? theme.colors.branco : corDoMarcador(theme, $situacao)};
`

function corDoMarcador(theme: DefaultTheme, situacao: SituacaoEtapa) {
  switch (situacao) {
    case 'concluido': return theme.colors.destaque
    case 'ocorrencia': return theme.status.EM_SEPARACAO.texto
    case 'cancelado': return theme.colors.obrigatorio
    default: return theme.colors.bordaCampo
  }
}
