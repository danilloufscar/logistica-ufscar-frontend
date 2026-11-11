import styled from 'styled-components'
import { cartao } from '@/components/ui'

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 600px) minmax(240px, 1fr);
  gap: 24px;
  align-items: start;
  margin-top: 24px;
  @media (max-width: 1000px) { grid-template-columns: minmax(0, 1fr); }
`

export const Card = styled.section`
  ${cartao}
  padding: 24px;
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; margin-bottom: 16px; }
  p { line-height: 1.6; }
  @media (max-width: 600px) { padding: 20px; }
`

export const Form = styled.form`
  display: grid;
  gap: 20px;
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 20px; min-width: 0; }
  fieldset:disabled { opacity: 0.7; }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`

export const Ajuda = styled.p`
  color: ${({ theme }) => theme.colors.textoSecundario};
  font-size: ${({ theme }) => theme.font.legenda.size};
`

export const Dados = styled.dl`
  display: grid;
  gap: 16px;
  dt { color: ${({ theme }) => theme.colors.textoSecundario}; font-size: ${({ theme }) => theme.font.legenda.size}; }
  dd { margin: 4px 0 0; overflow-wrap: anywhere; }
`

export const Consulta = styled.div`
  margin-top: 24px;
`

export const Situacao = styled.span<{ $alerta: boolean }>`
  display: inline-block;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.pilula};
  font-size: ${({ theme }) => theme.font.legenda.size};
  font-weight: 600;
  background: ${({ theme, $alerta }) => $alerta ? theme.status.ATRASADO.fundo : theme.status.ENTREGUE.fundo};
  color: ${({ theme, $alerta }) => $alerta ? theme.status.ATRASADO.texto : theme.status.ENTREGUE.texto};
`
