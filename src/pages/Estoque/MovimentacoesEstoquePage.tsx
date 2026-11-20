import { useCallback, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, ButtonLink, Eyebrow, Page } from '@/components/ui'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import { useConsulta } from '@/hooks/useConsulta'
import { listarMovimentacoes } from '@/services/estoqueService'
import type { MovimentacaoEstoque, TipoMovimentacao } from '@/types/estoque'
import { formatarData, formatarDataHora } from '@/utils/pedido'
import * as S from './styles'

const TIPOS: Record<TipoMovimentacao, string> = {
  ENTRADA: 'Entrada', SAIDA: 'Saída por despacho', AJUSTE_ENTRADA: 'Ajuste de entrada', AJUSTE_SAIDA: 'Ajuste de saída',
}
const COLUNAS: readonly Coluna<MovimentacaoEstoque>[] = [
  { titulo: 'Data', valor: item => formatarData(item.data) },
  { titulo: 'Tipo', valor: item => TIPOS[item.tipo] },
  { titulo: 'Quantidade', alinhamento: 'direita', valor: item => `${item.tipo === 'SAIDA' || item.tipo === 'AJUSTE_SAIDA' ? '−' : '+'}${item.quantidade.toLocaleString('pt-BR')}` },
  { titulo: 'Responsável', valor: item => item.usuarioResponsavel },
  { titulo: 'Pedido / justificativa', valor: item => item.pedidoId !== null ? <Link to={`/pedidos/${item.pedidoId}`}>Pedido #{item.pedidoId}</Link> : (item.justificativa || 'Entrada de estoque') },
  { titulo: 'Registro', valor: item => formatarDataHora(item.registradoEm) },
]
const TEXTOS = {
  carregando: 'Carregando movimentações…', vazio: 'Nenhuma movimentação registrada',
  dicaVazio: 'As entradas, os despachos e os ajustes deste produto aparecerão aqui.',
  legenda: (total: number) => `${total} ${total === 1 ? 'movimentação' : 'movimentações'}`,
}

export function MovimentacoesEstoquePage() {
  const { produtoId = '' } = useParams()
  const id = Number(produtoId)
  if (!/^\d+$/.test(produtoId) || !Number.isSafeInteger(id) || id <= 0) {
    return <Page><h1>Produto inválido</h1><ButtonLink to="/estoque">Consultar saldos</ButtonLink></Page>
  }
  return <HistoricoProduto key={id} produtoId={id} />
}

function HistoricoProduto({ produtoId }: { produtoId: number }) {
  useEffect(() => { document.title = 'Movimentações de estoque | SGLU' }, [])
  const carregar = useCallback((signal: AbortSignal) => listarMovimentacoes(produtoId, signal), [produtoId])
  const consulta = useConsulta(carregar, 'Não foi possível carregar as movimentações deste produto.')
  const produto = consulta.dados?.[0]
  return <Page aria-labelledby="movimentacoes-titulo">
    <Eyebrow>Estoque</Eyebrow>
    <h1 id="movimentacoes-titulo">Movimentações de estoque</h1>
    <S.Ajuda>{produto ? `${produto.produtoNome} (${produto.produtoCodigo})` : `Produto #${produtoId}`} · Mais recentes primeiro. Quantidades em unidades; + representa entrada e − representa saída.</S.Ajuda>
    <S.Actions>
      <ButtonLink to="/estoque">Consultar saldos</ButtonLink>
      <Button onClick={consulta.atualizar} disabled={consulta.carregando}>{consulta.carregando ? 'Atualizando…' : 'Atualizar movimentações'}</Button>
    </S.Actions>
    <S.Consulta><TabelaDados consulta={consulta} colunas={COLUNAS} textos={TEXTOS}
      rodape={consulta.erro ? 'Os dados exibidos são da última consulta bem-sucedida.' : undefined} /></S.Consulta>
  </Page>
}
