import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Button, ErrorText, Eyebrow, Field, Page, PrimaryButton } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { buscarRelatorio, type PeriodoRelatorio } from '@/services/relatorioService'
import { formatarData, hojeEmSaoPaulo } from '@/utils/pedido'
import * as S from './styles'

function periodoInicial(): PeriodoRelatorio {
  const fim = hojeEmSaoPaulo()
  return { inicio: fim.slice(0, 8) + '01', fim }
}

function Resultado({ periodo }: { periodo: PeriodoRelatorio }) {
  const carregar = useCallback((signal: AbortSignal) => buscarRelatorio(periodo, signal), [periodo])
  const consulta = useConsulta(carregar, 'Não foi possível carregar os relatórios.')
  const dados = consulta.dados
  return <div aria-busy={consulta.carregando}>
    <p>Período consultado: {formatarData(periodo.inicio)} a {formatarData(periodo.fim)} (inclusive).</p>
    {consulta.carregando && <p role="status">Carregando indicadores…</p>}
    {consulta.erro && <div role="alert"><ErrorText>{consulta.erro}</ErrorText>
      <Button onClick={consulta.atualizar} disabled={consulta.carregando}>Tentar novamente</Button></div>}
    {dados && <S.Indicadores>
      <S.Card aria-labelledby="quantidade-titulo">
        <h2 id="quantidade-titulo">Pedidos por status</h2>
        <p>Pedidos criados no período, agrupados pelo status atual. Cancelados não são contabilizados.</p>
        <S.Tabela>
          <caption>Quantidade de pedidos por status</caption>
          <thead><tr><th scope="col">Status</th><th scope="col">Quantidade</th></tr></thead>
          <tbody>{dados.pedidosPorStatus.map(item => <tr key={item.status}>
            <th scope="row">{item.rotulo}</th><td>{item.quantidade}</td>
          </tr>)}</tbody>
          <tfoot><tr><th scope="row">Total</th><td>{dados.totalPedidos}</td></tr></tfoot>
        </S.Tabela>
        {dados.totalPedidos === 0 && <p>Nenhum pedido não cancelado foi criado neste período.</p>}
      </S.Card>
      <S.Card aria-labelledby="pontualidade-titulo">
        <h2 id="pontualidade-titulo">Entregas no prazo</h2>
        <p>Considera os pedidos entregues no período, mesmo que tenham sido criados antes.</p>
        {dados.percentualNoPrazo === null ? <p>Sem entregas no período. Percentual não calculado.</p> : <>
          <S.Percentual>{dados.percentualNoPrazo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</S.Percentual>
          <p>{dados.entregasNoPrazo} de {dados.entregasNoPeriodo} entregas no prazo.</p>
        </>}
        <p>A entrega é pontual quando registrada até o dia do prazo, inclusive. Datas no fuso de São Paulo.</p>
      </S.Card>
      <S.Card aria-labelledby="tempo-medio-titulo">
        <h2 id="tempo-medio-titulo">Tempo médio de entrega</h2>
        <p>Da criação até a entrega dos pedidos entregues no período.</p>
        {dados.tempoMedioEntregaDias === null ? <p>Sem entregas no período. Média não calculada.</p> : <>
          <S.Percentual>{dados.tempoMedioEntregaDias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} dias</S.Percentual>
          <p>Base de cálculo: {dados.entregasNoPeriodo} entregas.</p>
        </>}
        <p>Duração em dias de 24 horas, incluindo frações de dia. Pedidos cancelados ficam fora da média.</p>
      </S.Card>
    </S.Indicadores>}
  </div>
}

export function RelatoriosPage() {
  const [periodo, setPeriodo] = useState(periodoInicial)
  const [inicio, setInicio] = useState(periodo.inicio)
  const [fim, setFim] = useState(periodo.fim)
  const [erro, setErro] = useState<string | null>(null)
  const [consulta, setConsulta] = useState(0)
  useEffect(() => { document.title = 'Relatórios de desempenho | SGLU' }, [])

  function consultar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!inicio || !fim || inicio > fim || inicio.length !== 10 || fim.length !== 10) {
      setErro('Informe um período válido, com início até a data final.')
      return
    }
    setErro(null)
    setPeriodo({ inicio, fim })
    setConsulta(valor => valor + 1)
  }

  return <Page>
    <Eyebrow>Administração</Eyebrow>
    <h1>Relatórios de desempenho</h1>
    <S.Filtros onSubmit={consultar}>
      <Field><label htmlFor="relatorio-inicio">Data inicial</label>
        <input id="relatorio-inicio" type="date" min="0001-01-01" max="9999-12-31" required value={inicio}
          onChange={e => setInicio(e.target.value)} aria-describedby={erro ? 'erro-periodo' : undefined} /></Field>
      <Field><label htmlFor="relatorio-fim">Data final</label>
        <input id="relatorio-fim" type="date" min="0001-01-01" max="9999-12-31" required value={fim}
          onChange={e => setFim(e.target.value)} aria-describedby={erro ? 'erro-periodo' : undefined} /></Field>
      <PrimaryButton type="submit">Consultar relatório</PrimaryButton>
    </S.Filtros>
    {erro && <ErrorText id="erro-periodo" role="alert">{erro}</ErrorText>}
    <Resultado key={consulta} periodo={periodo} />
  </Page>
}
