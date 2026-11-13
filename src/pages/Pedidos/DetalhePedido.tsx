import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DialogoConfirmacao } from '@/components/DialogoConfirmacao'
import { SeloStatus } from '@/components/SeloStatus'
import { Table } from '@/components/TabelaDados/styles'
import { Button, ButtonLink, Oculto, Page, PrimaryButton } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { mensagemDeErro } from '@/services/api'
import { avancarPedido, buscarPedido, cancelarPedido, itensSemEstoque } from '@/services/pedidoService'
import type { ItemSemEstoque, Pedido } from '@/types/pedido'
import { AlertaEstoque } from './AlertaEstoque'
import {
  FLUXO_STATUS, ROTULO_STATUS, formatarData, formatarDataHora, idDePedido, permiteAlteracao, proximoStatus,
} from '@/utils/pedido'
import { EstadoConsulta, PedidoNaoEncontrado } from './EstadoConsulta'
import * as S from './styles'

export function DetalhePedidoPage() {
  const id = idDePedido(useParams().id)
  useEffect(() => { document.title = `Pedido${id ? ` #${id}` : ''} | SGLU` }, [id])
  if (!id) {
    return (
      <Page>
        <S.Trilha aria-label="Você está em"><Link to="/pedidos">Pedidos</Link></S.Trilha>
        <h1>Pedido</h1>
        <PedidoNaoEncontrado />
      </Page>
    )
  }
  return <DetalhePedido key={id} id={id} />
}

type Acao = 'avancar' | 'cancelar'

function DetalhePedido({ id }: { id: number }) {
  const carregar = useCallback((signal: AbortSignal) => buscarPedido(id, signal), [id])
  const consulta = useConsulta(carregar, 'Não foi possível carregar o pedido.')
  const { atualizar, substituir } = consulta
  const pedido = consulta.dados
  const [acao, setAcao] = useState<Acao | null>(null)
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false)
  const [faltas, setFaltas] = useState<ItemSemEstoque[] | null>(null)
  const requisicao = useRef<AbortController | null>(null)

  useEffect(() => () => requisicao.current?.abort(), [])

  async function executar(tipo: Acao, chamada: (signal: AbortSignal) => Promise<Pedido>, sucesso: (pedido: Pedido) => string) {
    if (requisicao.current) return
    const controller = new AbortController()
    requisicao.current = controller
    setAcao(tipo)
    setFaltas(null)
    try {
      const atualizado = await chamada(controller.signal)
      if (controller.signal.aborted) return
      substituir(atualizado)
      toast.success(sucesso(atualizado))
    } catch (erro) {
      if (controller.signal.aborted) return
      const insuficientes = itensSemEstoque(erro)
      if (insuficientes) setFaltas(insuficientes)
      else toast.error(mensagemDeErro(erro, 'Não foi possível atualizar o pedido.'))
      // O pedido pode ter mudado (outra pessoa, clique duplo ou falha de rede após a gravação).
      atualizar()
    } finally {
      if (requisicao.current === controller) {
        requisicao.current = null
        setAcao(null)
      }
    }
  }

  const proximo = pedido ? proximoStatus(pedido.status) : undefined

  function avancar() {
    if (!pedido || !proximo) return
    void executar('avancar', (signal) => avancarPedido(id, pedido.status, signal),
      (atualizado) => `Pedido avançado para ${ROTULO_STATUS[atualizado.status]}.`)
  }

  function cancelar() {
    setConfirmandoCancelamento(false)
    void executar('cancelar', (signal) => cancelarPedido(id, signal), () => 'Pedido cancelado.')
  }

  return (
    <Page aria-labelledby="pedido-titulo">
      <S.Trilha aria-label="Você está em"><Link to="/pedidos">Pedidos</Link> / #{id}</S.Trilha>
      <S.Cabecalho>
        <S.Titulo>
          <h1 id="pedido-titulo">Pedido #{id}</h1>
          {pedido && (
            <S.Selos>
              <SeloStatus status={pedido.status} />
              {pedido.atrasado && <SeloStatus status="ATRASADO" />}
            </S.Selos>
          )}
        </S.Titulo>
        {pedido && (permiteAlteracao(pedido.status) || proximo) && (
          <S.Acoes aria-busy={acao !== null}>
            {permiteAlteracao(pedido.status) && (
              <>
                <Button type="button" disabled={acao !== null} onClick={() => setConfirmandoCancelamento(true)}>
                  {acao === 'cancelar' ? 'Cancelando…' : 'Cancelar pedido'}
                </Button>
                <ButtonLink to={`/pedidos/${id}/editar`}>Editar</ButtonLink>
              </>
            )}
            {proximo && (
              <PrimaryButton type="button" disabled={acao !== null} onClick={avancar}>
                {acao === 'avancar' ? 'Avançando…' : `Avançar para ${ROTULO_STATUS[proximo]}`}
              </PrimaryButton>
            )}
          </S.Acoes>
        )}
      </S.Cabecalho>

      {pedido?.status === 'EM_SEPARACAO' && (
        <S.InformacaoDespacho>Ao despachar, o estoque de todos os itens será baixado. Se faltar saldo em algum produto, o pedido permanecerá em separação.</S.InformacaoDespacho>
      )}
      {faltas && pedido?.status === 'EM_SEPARACAO' && <AlertaEstoque itens={faltas} />}

      {!pedido ? (
        <EstadoConsulta textoCarregando="Carregando pedido…" erro={consulta.erro}
          carregando={consulta.carregando} aoTentarNovamente={atualizar} />
      ) : (
        <S.LayoutDetalhe>
          <S.Coluna>
            <S.Cartao aria-labelledby="pedido-dados">
              <h2 id="pedido-dados">Dados do pedido</h2>
              <S.Dados>
                <div><dt>Cliente</dt><dd>{pedido.cliente.nome}</dd></div>
                <div>
                  <dt>Prazo de entrega</dt>
                  <dd><S.Prazo $atrasado={pedido.atrasado}>{formatarData(pedido.prazoEntrega)}</S.Prazo></dd>
                </div>
                <div><dt>Endereço de entrega</dt><dd>{pedido.enderecoEntrega}</dd></div>
                <div><dt>Código de consulta do cliente</dt><dd><S.Codigo>{pedido.codigo}</S.Codigo></dd></div>
              </S.Dados>
            </S.Cartao>

            <S.Cartao aria-labelledby="pedido-itens">
              <h2 id="pedido-itens">Itens</h2>
              <Table>
                <caption>Itens do pedido</caption>
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Código</th>
                    <th scope="col" data-alinhamento="direita">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.itens.map((item) => (
                    <tr key={item.produto.id}>
                      <td data-label="Produto">{item.produto.nome}</td>
                      <td data-label="Código">{item.produto.codigo}</td>
                      <td data-label="Quantidade" data-alinhamento="direita">{item.quantidade.toLocaleString('pt-BR')} un.</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </S.Cartao>
          </S.Coluna>

          <S.Cartao aria-labelledby="pedido-linha-do-tempo">
            <h2 id="pedido-linha-do-tempo">Linha do tempo</h2>
            <LinhaDoTempo pedido={pedido} />
          </S.Cartao>
        </S.LayoutDetalhe>
      )}

      <DialogoConfirmacao aberto={confirmandoCancelamento} titulo={`Cancelar o pedido #${id}?`}
        confirmar="Cancelar pedido" aoConfirmar={cancelar} aoFechar={() => setConfirmandoCancelamento(false)}>
        O pedido passa para o status Cancelado e não poderá mais ser editado nem avançar.
      </DialogoConfirmacao>
    </Page>
  )
}

/** RF07 / RF13: etapas com data, hora e usuário; as seguintes aparecem como pendentes. */
function LinhaDoTempo({ pedido }: { pedido: Pedido }) {
  const registros = new Map(pedido.historico.map((registro) => [registro.status, registro]))
  // Um pedido cancelado mostra só o que aconteceu; os demais, o fluxo completo.
  const etapas = pedido.status === 'CANCELADO' ? pedido.historico.map((registro) => registro.status) : FLUXO_STATUS
  const proximo = proximoStatus(pedido.status)

  return (
    <S.LinhaDoTempo>
      {etapas.map((status) => {
        const registro = registros.get(status)
        const situacao = registro
          ? (status === 'CANCELADO' ? 'cancelado' : 'concluido')
          : (status === proximo ? 'proximo' : 'pendente')
        return (
          <li key={status} data-situacao={situacao} aria-current={status === pedido.status ? 'step' : undefined}>
            <S.Marcador $situacao={situacao} aria-hidden="true" />
            <div>
              <strong>{ROTULO_STATUS[status]}</strong>
              {registro && <span>{formatarDataHora(registro.dataHora)} · {registro.usuario.nome}</span>}
              {situacao === 'proximo' && <span>Próxima etapa</span>}
              {situacao === 'pendente' && <Oculto>Etapa pendente</Oculto>}
            </div>
          </li>
        )
      })}
    </S.LinhaDoTempo>
  )
}
