import { useCallback, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import { ButtonLink, Field, Page, Trilha } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { listarMovimentacoes, listarSaldos } from '@/services/estoqueService'
import type { MovimentacaoEstoque, TipoMovimentacao } from '@/types/estoque'
import { ROTULO_MOVIMENTACAO, ehSaida, rotuloProduto, unidades } from '@/utils/estoque'
import { diaEmSaoPaulo, formatarData, formatarDataHora } from '@/utils/pedido'
import * as S from './styles'

const VARIANTE: Record<TipoMovimentacao, 'entrada' | 'saida' | 'ajuste'> = {
  ENTRADA: 'entrada', SAIDA: 'saida', AJUSTE_ENTRADA: 'ajuste', AJUSTE_SAIDA: 'ajuste',
}

/** A data informada na entrada pode ser anterior ao registro; nesse caso, os dois aparecem. */
function quando(item: MovimentacaoEstoque) {
  if (item.data === diaEmSaoPaulo(item.registradoEm)) return formatarDataHora(item.registradoEm)
  return <>{formatarData(item.data)}<S.Secundario>registrada em {formatarDataHora(item.registradoEm)}</S.Secundario></>
}

const COLUNAS: readonly Coluna<MovimentacaoEstoque>[] = [
  { titulo: 'Data', valor: quando, semQuebra: true },
  { titulo: 'Tipo', valor: (item) => <S.Selo $variante={VARIANTE[item.tipo]}>{ROTULO_MOVIMENTACAO[item.tipo]}</S.Selo> },
  {
    titulo: 'Quantidade', alinhamento: 'direita', semQuebra: true,
    valor: (item) => `${ehSaida(item.tipo) ? '−' : '+'}${item.quantidade.toLocaleString('pt-BR')}`,
  },
  { titulo: 'Saldo após', alinhamento: 'direita', valor: (item) => item.saldoApos?.toLocaleString('pt-BR') ?? '—' },
  { titulo: 'Usuário', valor: (item) => item.usuarioResponsavel },
  {
    titulo: 'Pedido ou justificativa',
    valor: (item) => item.pedidoId !== null
      ? <S.LinkTabela to={`/pedidos/${item.pedidoId}`}>Pedido #{item.pedidoId}</S.LinkTabela>
      : (item.justificativa || 'Entrada de produtos'),
  },
]

const TEXTOS = {
  carregando: 'Carregando movimentações…',
  vazio: 'Nenhuma movimentação registrada',
  dicaVazio: 'As entradas, as saídas por despacho e os ajustes deste produto aparecerão aqui.',
  legenda: (total: number) => `${total} ${total === 1 ? 'movimentação' : 'movimentações'}, mais recentes primeiro`,
}

/** Tela 10: histórico de movimentações de cada produto (RF12). */
export function MovimentacoesEstoquePage() {
  const { produtoId = '' } = useParams()
  const id = Number(produtoId)
  useEffect(() => { document.title = 'Histórico de movimentações | SGLU' }, [])
  if (!/^\d+$/.test(produtoId) || !Number.isSafeInteger(id) || id <= 0) {
    return (
      <Page>
        <Trilha aria-label="Você está em"><Link to="/estoque">Estoque</Link> / Histórico</Trilha>
        <h1>Produto inválido</h1>
        <ButtonLink to="/estoque">Consultar estoque</ButtonLink>
      </Page>
    )
  }
  return <HistoricoProduto key={id} produtoId={id} />
}

function HistoricoProduto({ produtoId }: { produtoId: number }) {
  const navigate = useNavigate()
  const saldos = useConsulta(listarSaldos, 'Não foi possível carregar os produtos.')
  const carregar = useCallback((signal: AbortSignal) => listarMovimentacoes(produtoId, signal), [produtoId])
  const movimentacoes = useConsulta(carregar, 'Não foi possível carregar as movimentações deste produto.')
  const produto = saldos.dados?.find((item) => item.id === produtoId)

  return (
    <Page aria-labelledby="movimentacoes-titulo">
      <Trilha aria-label="Você está em"><Link to="/estoque">Estoque</Link> / Histórico</Trilha>
      <h1 id="movimentacoes-titulo">Histórico de movimentações</h1>

      <S.Filtro>
        <Field>
          <label htmlFor="historico-produto">Produto</label>
          <select id="historico-produto" value={String(produtoId)} disabled={!saldos.dados}
            onChange={(evento) => navigate(`/estoque/produtos/${evento.target.value}/movimentacoes`)}>
            {!produto && <option value={String(produtoId)}>{saldos.dados ? `Produto #${produtoId}` : 'Carregando produtos…'}</option>}
            {saldos.dados?.map((item) => <option key={item.id} value={String(item.id)}>{rotuloProduto(item)}</option>)}
          </select>
        </Field>
        {produto && (
          <>
            <S.Indicador><span>Saldo atual</span><strong>{unidades(produto.saldo)}</strong></S.Indicador>
            <S.Indicador><span>Estoque mínimo</span><strong>{unidades(produto.estoqueMinimo)}</strong></S.Indicador>
          </>
        )}
      </S.Filtro>

      <S.Consulta>
        <TabelaDados consulta={movimentacoes} colunas={COLUNAS} textos={TEXTOS} rodape="Mais recentes primeiro" />
      </S.Consulta>
    </Page>
  )
}
