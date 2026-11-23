import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LinhaDoTempo } from '@/components/LinhaDoTempo'
import { SeloStatus } from '@/components/SeloStatus'
import { Table } from '@/components/TabelaDados/styles'
import { Button, ButtonLink, ErrorText, Eyebrow, Page, PrimaryButton, TextButton } from '@/components/ui'
import { INTERVALO_ATUALIZACAO_MS, useAtualizacaoPeriodica } from '@/hooks/useAtualizacaoPeriodica'
import { useConsulta } from '@/hooks/useConsulta'
import { mensagemDeErro } from '@/services/api'
import { buscarTimeline } from '@/services/ocorrenciaService'
import { avancarPedido, itensSemEstoque, listarPedidos } from '@/services/pedidoService'
import type { ItemSemEstoque, ResumoPedido, StatusPedido } from '@/types/pedido'
import { etapasDoPedido } from '@/utils/linhaDoTempo'
import { ROTULO_STATUS, formatarData, proximoStatus } from '@/utils/pedido'
import * as S from './styles'

type AbaEntregas = 'andamento' | 'atrasados'

/** Pedidos que já saíram do armazém e ainda não foram entregues. */
const EM_ROTA: readonly StatusPedido[] = ['DESPACHADO', 'EM_TRANSITO']
const SEGUNDOS = INTERVALO_ATUALIZACAO_MS / 1000

function abaDeParametro(valor: string | null): AbaEntregas {
  return valor === 'atrasados' ? 'atrasados' : 'andamento'
}

/** Prazo mais próximo primeiro: o que precisa de atenção fica no topo. */
function porPrazo(a: ResumoPedido, b: ResumoPedido) {
  return a.prazoEntrega.localeCompare(b.prazoEntrega) || a.id - b.id
}

const horario = (data: Date) => data.toLocaleTimeString('pt-BR')

/** Tela 11: acompanhamento de entregas (RF13, RF15 e RF16). */
export function EntregasPage() {
  useEffect(() => { document.title = 'Acompanhamento de entregas | SGLU' }, [])
  const consulta = useConsulta(listarPedidos, 'Não foi possível carregar as entregas.')
  const { atualizar } = consulta
  useAtualizacaoPeriodica(atualizar)

  const [parametros, setParametros] = useSearchParams()
  const aba = abaDeParametro(parametros.get('aba'))
  const pedidos = consulta.dados

  const emAndamento = useMemo(() => (pedidos ?? []).filter((p) => EM_ROTA.includes(p.status)).sort(porPrazo), [pedidos])
  // RF15/RN05: atrasados em qualquer etapa aberta, inclusive os que ainda não saíram do armazém.
  const atrasados = useMemo(() => (pedidos ?? []).filter((p) => p.atrasado).sort(porPrazo), [pedidos])
  const visiveis = aba === 'atrasados' ? atrasados : emAndamento

  const idEscolhido = Number(parametros.get('pedido'))
  const selecionado = visiveis.find((p) => p.id === idEscolhido) ?? visiveis[0] ?? null

  function trocarParametros(alterar: (novos: URLSearchParams) => void) {
    setParametros((atuais) => {
      const novos = new URLSearchParams(atuais)
      alterar(novos)
      return novos
    }, { replace: true })
  }

  const escolherAba = (nova: AbaEntregas) => trocarParametros((novos) => {
    if (nova === 'andamento') novos.delete('aba')
    else novos.set('aba', nova)
    novos.delete('pedido')
  })
  const painel = useRef<HTMLDivElement>(null)
  const selecionar = (id: number) => {
    trocarParametros((novos) => novos.set('pedido', String(id)))
    // Em telas estreitas o painel fica abaixo da lista; leva o usuário até ele.
    if (window.matchMedia('(max-width: 1000px)').matches) {
      requestAnimationFrame(() => painel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  return (
    <Page aria-labelledby="entregas-titulo">
      <S.Cabecalho>
        <div>
          <Eyebrow>Operação</Eyebrow>
          <h1 id="entregas-titulo">Acompanhamento de entregas</h1>
        </div>
        <S.Atualizacao $falhou={Boolean(consulta.erro)}>
          {consulta.erro
            ? `Falha ao atualizar · nova tentativa em ${SEGUNDOS} s`
            : consulta.atualizadoEm
              ? `Atualizado às ${horario(consulta.atualizadoEm)} · atualiza a cada ${SEGUNDOS} s`
              : 'Carregando…'}
        </S.Atualizacao>
      </S.Cabecalho>

      <S.Abas role="group" aria-label="Filtrar entregas">
        <S.Aba type="button" aria-pressed={aba === 'andamento'} onClick={() => escolherAba('andamento')}>
          Em andamento{pedidos && ` (${emAndamento.length})`}
        </S.Aba>
        <S.Aba type="button" aria-pressed={aba === 'atrasados'} onClick={() => escolherAba('atrasados')}>
          Atrasados{pedidos && ` (${atrasados.length})`}
        </S.Aba>
      </S.Abas>

      <S.Layout>
        <S.ListaCard aria-busy={consulta.carregando}>
          {pedidos === null && consulta.carregando && <S.Estado role="status">Carregando entregas…</S.Estado>}
          {pedidos === null && consulta.erro && !consulta.carregando && (
            <S.Estado>
              <h2>Não foi possível carregar as entregas</h2>
              <ErrorText role="alert">{consulta.erro}</ErrorText>
              <Button type="button" onClick={atualizar}>Tentar novamente</Button>
            </S.Estado>
          )}
          {pedidos && consulta.erro && (
            <S.Aviso role="alert">
              <span><strong>Lista desatualizada.</strong> {consulta.erro}</span>
              <Button type="button" onClick={atualizar} disabled={consulta.carregando}>Tentar novamente</Button>
            </S.Aviso>
          )}
          {pedidos && visiveis.length === 0 && (
            <S.Estado role="status">
              <h2>{aba === 'atrasados' ? 'Nenhum pedido atrasado' : 'Nenhuma entrega em andamento'}</h2>
              <p>{aba === 'atrasados'
                ? 'Pedidos com prazo vencido que ainda não foram entregues aparecem aqui.'
                : 'Pedidos despachados ou em trânsito aparecem aqui.'}</p>
            </S.Estado>
          )}
          {visiveis.length > 0 && (
            <Table>
              <caption>{aba === 'atrasados' ? 'Pedidos atrasados' : 'Entregas em andamento'}, prazo mais próximo primeiro</caption>
              <thead>
                <tr>
                  <th scope="col">Pedido</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Status</th>
                  <th scope="col">Prazo</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((pedido) => {
                  const ativo = pedido.id === selecionado?.id
                  return (
                    <tr key={pedido.id} data-alerta={pedido.atrasado || undefined} data-selecionado={ativo || undefined}
                      onClick={() => selecionar(pedido.id)}>
                      <th scope="row" data-label="Pedido">
                        <S.BotaoPedido type="button" aria-pressed={ativo}
                          onClick={(evento) => { evento.stopPropagation(); selecionar(pedido.id) }}>
                          #{pedido.id}
                        </S.BotaoPedido>
                      </th>
                      <td data-label="Cliente">{pedido.cliente.nome}</td>
                      <td data-label="Status">
                        <S.Selos>
                          <SeloStatus status={pedido.status} />
                          {pedido.atrasado && <SeloStatus status="ATRASADO" />}
                        </S.Selos>
                      </td>
                      <td data-label="Prazo"><S.Prazo $atrasado={pedido.atrasado}>{formatarData(pedido.prazoEntrega)}</S.Prazo></td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </S.ListaCard>

        <div ref={painel}>
          {selecionado && (
            // A troca de status recria o painel, que então busca a linha do tempo atualizada.
            <PainelEntrega key={`${selecionado.id}-${selecionado.status}`} pedido={selecionado} aba={aba} aoAlterar={atualizar} />
          )}
        </div>
      </S.Layout>
    </Page>
  )
}

function PainelEntrega({ pedido, aba, aoAlterar }: { pedido: ResumoPedido; aba: AbaEntregas; aoAlterar: () => void }) {
  const { id, status } = pedido
  const carregar = useCallback((signal: AbortSignal) => buscarTimeline(id, signal), [id])
  const timeline = useConsulta(carregar, 'Não foi possível carregar a linha do tempo.')
  useAtualizacaoPeriodica(timeline.atualizar)

  const [avancando, setAvancando] = useState(false)
  const [faltas, setFaltas] = useState<ItemSemEstoque[] | null>(null)
  const requisicao = useRef<AbortController | null>(null)
  useEffect(() => () => requisicao.current?.abort(), [])

  const proximo = proximoStatus(status)

  async function avancar() {
    if (!proximo || requisicao.current) return
    const controller = new AbortController()
    requisicao.current = controller
    setAvancando(true)
    setFaltas(null)
    try {
      const atualizado = await avancarPedido(id, status, controller.signal)
      if (controller.signal.aborted) return
      toast.success(`Pedido #${id} ${atualizado.status === 'ENTREGUE' ? 'marcado como Entregue' : `avançado para ${ROTULO_STATUS[atualizado.status]}`}.`)
    } catch (erro) {
      if (controller.signal.aborted) return
      const insuficientes = itensSemEstoque(erro)
      if (insuficientes) setFaltas(insuficientes)
      else toast.error(mensagemDeErro(erro, 'Não foi possível atualizar o pedido.'))
    } finally {
      if (requisicao.current === controller) {
        requisicao.current = null
        setAvancando(false)
        // Sucesso ou falha, a lista mostra o estado atual (outra pessoa pode ter alterado o pedido).
        aoAlterar()
      }
    }
  }

  return (
    <S.Painel aria-labelledby="painel-pedido-titulo">
      <h2 id="painel-pedido-titulo"><S.LinkPedido to={`/pedidos/${id}`}>Pedido #{id}</S.LinkPedido></h2>
      <S.Subtitulo>{pedido.cliente.nome} · prazo {formatarData(pedido.prazoEntrega)}</S.Subtitulo>

      {timeline.dados === null && timeline.carregando && <p role="status">Carregando linha do tempo…</p>}
      {timeline.erro && (
        <ErrorText role="alert">
          {timeline.erro}{timeline.dados && ' Exibindo a última consulta disponível.'}{' '}
          <TextButton type="button" onClick={timeline.atualizar} disabled={timeline.carregando}>Tentar novamente</TextButton>
        </ErrorText>
      )}
      {timeline.dados && <LinhaDoTempo rotulo={`Linha do tempo do pedido #${id}`} etapas={etapasDoPedido(timeline.dados, status, false)} />}

      {faltas && (
        <S.Falta role="alert">
          <strong>Despacho bloqueado por falta de estoque.</strong> Nenhum item foi baixado.
          <ul>{faltas.map((item) => <li key={item.produtoId}>{item.nome}: faltam {item.faltante.toLocaleString('pt-BR')} un.</li>)}</ul>
        </S.Falta>
      )}

      <S.AcoesPainel>
        <ButtonLink to={`/pedidos/${id}/ocorrencias/nova?origem=entregas${aba === 'atrasados' ? '&aba=atrasados' : ''}`}>
          Registrar ocorrência
        </ButtonLink>
        {proximo && (
          <PrimaryButton type="button" disabled={avancando} onClick={() => void avancar()}>
            {avancando ? 'Salvando…' : proximo === 'ENTREGUE' ? 'Marcar como Entregue' : `Avançar para ${ROTULO_STATUS[proximo]}`}
          </PrimaryButton>
        )}
      </S.AcoesPainel>
    </S.Painel>
  )
}
