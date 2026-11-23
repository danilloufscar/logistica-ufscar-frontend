import { useEffect } from 'react'
import { ButtonLink, Eyebrow, Page, PrimaryButtonLink } from '@/components/ui'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import { useConsulta } from '@/hooks/useConsulta'
import { listarSaldos } from '@/services/estoqueService'
import { useAppSelector } from '@/store/hooks'
import type { SaldoEstoque } from '@/types/estoque'
import { situacaoDoEstoque, unidades } from '@/utils/estoque'
import * as S from './styles'

const COLUNAS: readonly Coluna<SaldoEstoque>[] = [
  { titulo: 'Código', valor: (produto) => produto.codigo, semQuebra: true },
  { titulo: 'Produto', valor: (produto) => produto.nome },
  {
    titulo: 'Saldo atual', alinhamento: 'direita',
    valor: (produto) => <S.Quantidade $alerta={produto.abaixoOuNoMinimo}>{unidades(produto.saldo)}</S.Quantidade>,
  },
  { titulo: 'Estoque mínimo', alinhamento: 'direita', semQuebra: true, valor: (produto) => unidades(produto.estoqueMinimo) },
  {
    titulo: 'Situação',
    valor: (produto) => <S.Selo $variante={produto.abaixoOuNoMinimo ? 'alerta' : 'ok'}>{situacaoDoEstoque(produto)}</S.Selo>,
  },
  {
    titulo: 'Histórico', tituloOculto: true, alinhamento: 'direita',
    valor: (produto) => (
      <S.LinkTabela to={`/estoque/produtos/${produto.id}/movimentacoes`} aria-label={`Histórico de movimentações de ${produto.nome}`}>
        Histórico
      </S.LinkTabela>
    ),
  },
]

const TEXTOS = {
  carregando: 'Carregando estoque…',
  vazio: 'Nenhum produto cadastrado',
  dicaVazio: 'Cadastre um produto para acompanhar seu saldo de estoque.',
  legenda: (total: number) => `${total} ${total === 1 ? 'produto no estoque' : 'produtos no estoque'}`,
}

/** Tela 7: saldo por produto com alerta de estoque mínimo (RF10, RN04). */
export function SaldoEstoquePage() {
  const administrador = useAppSelector((state) => state.auth.usuario?.perfil === 'ADMINISTRADOR')
  useEffect(() => { document.title = 'Estoque | SGLU' }, [])
  const consulta = useConsulta(listarSaldos, 'Não foi possível carregar o estoque.')
  const alertas = consulta.dados?.filter((produto) => produto.abaixoOuNoMinimo).length ?? 0

  return (
    <Page aria-labelledby="estoque-titulo">
      <S.Cabecalho>
        <div>
          <Eyebrow>Operação · armazém único</Eyebrow>
          <h1 id="estoque-titulo">Estoque</h1>
        </div>
        <S.Acoes>
          {administrador && <ButtonLink to="/estoque/ajustes">Ajustar inventário</ButtonLink>}
          <PrimaryButtonLink to="/estoque/entradas">Registrar entrada</PrimaryButtonLink>
        </S.Acoes>
      </S.Cabecalho>

      {alertas > 0 && (
        <S.AvisoMinimo role="status">
          <strong>{alertas} {alertas === 1 ? 'produto' : 'produtos'}</strong>{' '}
          {alertas === 1 ? 'está' : 'estão'} com saldo igual ou abaixo do estoque mínimo.
        </S.AvisoMinimo>
      )}

      <S.Consulta>
        <TabelaDados consulta={consulta} colunas={COLUNAS} textos={TEXTOS}
          emAlerta={(produto) => produto.abaixoOuNoMinimo}
          acaoVazio={<ButtonLink to="/produtos">Cadastrar produto</ButtonLink>} />
      </S.Consulta>
      <S.Nota>O despacho de um pedido dá baixa automática nos itens. Sem saldo suficiente, o despacho é bloqueado.</S.Nota>
    </Page>
  )
}
