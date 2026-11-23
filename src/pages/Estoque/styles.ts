import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { cartao } from '@/components/ui'

/* Cabeçalho: título à esquerda e ações ou aviso à direita. */

export const Cabecalho = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
`

export const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

export const Exclusivo = styled.p`
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
`

/* Estoque (saldo) */

export const AvisoMinimo = styled.p`
  margin-top: 24px;
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.status.ATRASADO.fundo};
  color: ${({ theme }) => theme.status.ATRASADO.texto};
  line-height: 1.5;
`

export const Consulta = styled.div`
  margin-top: 24px;
`

export const Quantidade = styled.span<{ $alerta?: boolean }>`
  font-weight: ${({ theme }) => theme.font.textoForte.weight};
  white-space: nowrap;
  ${({ theme, $alerta }) => $alerta && `color: ${theme.status.ATRASADO.texto};`}
`

export const Selo = styled.span<{ $variante: 'alerta' | 'ok' | 'entrada' | 'saida' | 'ajuste' }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.pilula};
  font-size: ${({ theme }) => theme.font.legenda.size};
  font-weight: 600;
  white-space: nowrap;
  ${({ theme, $variante }) => {
    const cores = {
      alerta: theme.status.ATRASADO,
      ok: theme.status.ENTREGUE,
      entrada: theme.status.ENTREGUE,
      saida: theme.status.DESPACHADO,
      ajuste: theme.status.EM_SEPARACAO,
    }[$variante]
    return `background: ${cores.fundo}; color: ${cores.texto};`
  }}
`

export const LinkTabela = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  &:hover { text-decoration: underline; }
`

export const Nota = styled.p`
  margin-top: 16px;
  font-size: ${({ theme }) => theme.font.legenda.size};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textoSecundario};
`

/* Formulários (entrada e ajuste) */

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 400px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  margin-top: 24px;
  @media (max-width: 1000px) { grid-template-columns: minmax(0, 1fr); }
`

export const Card = styled.section`
  ${cartao}
  padding: 28px;
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; margin-bottom: 12px; }
  p { line-height: 1.6; }
  @media (max-width: 600px) { padding: 20px; }
`

export const CardFormulario = styled(Card)`
  max-width: 640px;
  margin-top: 24px;
`

/** Tabela dentro de um cartão: alinha as células com o título. */
export const CardTabela = styled(Card)`
  padding: 24px 12px 8px;
  h2 { padding: 0 12px; }
`

export const Form = styled.form`
  display: grid;
  gap: 20px;
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 20px; min-width: 0; }
  fieldset:disabled { opacity: 0.7; }
  input[readonly] { color: ${({ theme }) => theme.colors.textoSecundario}; cursor: default; }
`

export const Linha = styled.div<{ $colunas: 2 | 3 }>`
  display: grid;
  grid-template-columns: repeat(${({ $colunas }) => $colunas}, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`

export const Ajuda = styled.p`
  font-size: ${({ theme }) => theme.font.legenda.size};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textoSecundario};
`

export const InfoSaldo = styled.p`
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.colors.destaqueClaro};
  color: ${({ theme }) => theme.colors.textoSobreDestaqueClaro};
`

export const Botoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

export const Estado = styled.div`
  padding: 12px 0;
  color: ${({ theme }) => theme.colors.textoSecundario};
  button, a { margin-top: 12px; }
`

export const EstadoTabela = styled(Estado)`
  padding: 0 12px 16px;
`

/* Histórico */

export const Filtro = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin-top: 24px;
  > div:first-child { flex: 0 1 400px; }
`

export const Indicador = styled.div`
  ${cartao}
  padding: 10px 16px;
  span { display: block; font-size: ${({ theme }) => theme.font.legenda.size}; color: ${({ theme }) => theme.colors.textoSecundario}; }
  strong { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: 700; white-space: nowrap; }
`

export const Secundario = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
`
