import { useEffect } from 'react'
import { Button, ButtonLink, Eyebrow, Page, PrimaryButtonLink } from '@/components/ui'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import { useConsulta } from '@/hooks/useConsulta'
import { listarSaldos } from '@/services/estoqueService'
import type { SaldoEstoque } from '@/types/estoque'
import * as S from './styles'

const COLUNAS: readonly Coluna<SaldoEstoque>[] = [
  { titulo: 'Código', valor: produto => produto.codigo },
  { titulo: 'Produto', valor: produto => produto.nome },
  { titulo: 'Saldo atual', valor: produto => produto.saldo.toLocaleString('pt-BR'), alinhamento: 'direita' },
  { titulo: 'Estoque mínimo', valor: produto => produto.estoqueMinimo.toLocaleString('pt-BR'), alinhamento: 'direita' },
  { titulo: 'Situação', valor: produto => (
    <S.Situacao $alerta={produto.abaixoOuNoMinimo}>
      {produto.abaixoOuNoMinimo ? 'No mínimo ou abaixo' : 'Acima do mínimo'}
    </S.Situacao>
  ) },
]

const TEXTOS = {
  carregando: 'Carregando estoque…',
  vazio: 'Nenhum produto cadastrado',
  dicaVazio: 'Cadastre um produto para acompanhar seu saldo de estoque.',
  legenda: (total: number) => `${total} ${total === 1 ? 'produto no estoque' : 'produtos no estoque'}`,
}

export function SaldoEstoquePage() {
  useEffect(() => { document.title = 'Saldo de estoque | SGLU' }, [])
  const consulta = useConsulta(listarSaldos, 'Não foi possível carregar o estoque.')
  const alertas = consulta.dados?.filter(produto => produto.abaixoOuNoMinimo).length

  return (
    <Page aria-labelledby="estoque-titulo">
      <Eyebrow>Estoque</Eyebrow>
      <h1 id="estoque-titulo">Saldo de estoque</h1>
      <S.Ajuda>Quantidades em unidades. O alerta aparece quando o saldo é igual ou menor que o estoque mínimo.</S.Ajuda>
      <S.Actions>
        <PrimaryButtonLink to="/estoque/entradas">Registrar entrada</PrimaryButtonLink>
        <Button type="button" onClick={consulta.atualizar} disabled={consulta.carregando}>
          {consulta.carregando ? 'Atualizando…' : 'Atualizar saldos'}
        </Button>
      </S.Actions>
      <S.Consulta>
        <TabelaDados consulta={consulta} colunas={COLUNAS} textos={TEXTOS}
          emAlerta={produto => produto.abaixoOuNoMinimo}
          acaoVazio={<ButtonLink to="/produtos">Cadastrar produto</ButtonLink>}
          rodape={consulta.erro ? 'Os saldos exibidos são da última consulta bem-sucedida.'
            : consulta.carregando ? 'Atualizando saldos…'
              : `${alertas ?? 0} ${(alertas ?? 0) === 1 ? 'produto no mínimo ou abaixo.' : 'produtos no mínimo ou abaixo.'}`} />
      </S.Consulta>
    </Page>
  )
}
