import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format, isValid, parseISO } from 'date-fns'
import { LinhaDoTempo, type EtapaLinhaDoTempo } from '@/components/LinhaDoTempo'
import { SeloStatus } from '@/components/SeloStatus'
import { Button, PrimaryButton } from '@/components/ui'
import { useAcompanhamentoPolling } from '@/hooks/useAcompanhamentoPolling'
import type { AcompanhamentoPedido } from '@/types/acompanhamento'
import { FLUXO_STATUS, ROTULO_STATUS, formatarData } from '@/utils/pedido'
import * as S from './styles'

function quando(dataHora: string) {
    const valor = parseISO(dataHora)
    return isValid(valor) ? format(valor, "dd/MM/yyyy 'às' HH:mm") : dataHora
}

/** Etapas registradas e, enquanto o pedido estiver aberto, as que ainda faltam (RN01). */
function etapasPublicas(pedido: AcompanhamentoPedido): EtapaLinhaDoTempo[] {
    const etapas: EtapaLinhaDoTempo[] = pedido.timeline.map((etapa, indice) => ({
        chave: `${etapa.status}-${indice}`,
        titulo: etapa.status === 'CRIADO' ? 'Pedido criado' : (etapa.statusRotulo || ROTULO_STATUS[etapa.status]),
        situacao: etapa.status === 'CANCELADO' ? 'cancelado' : 'concluido',
        detalhe: quando(etapa.dataHora),
    }))
    const atual = FLUXO_STATUS.indexOf(pedido.status)
    if (atual >= 0) {
        for (const status of FLUXO_STATUS.slice(atual + 1)) {
            etapas.push({ chave: `pendente-${status}`, titulo: ROTULO_STATUS[status], situacao: 'pendente' })
        }
    }
    return etapas
}

/** Tela 13: Portal do Cliente, consulta pública pelo código do pedido (RF17). */
export function AcompanhamentoPage() {
    const { codigo: codigoUrl = '' } = useParams<{ codigo?: string }>()
    const navigate = useNavigate()
    const [campoCodigo, setCampoCodigo] = useState(codigoUrl)
    const [codigoUrlAnterior, setCodigoUrlAnterior] = useState(codigoUrl)

    if (codigoUrl !== codigoUrlAnterior) {
        setCodigoUrlAnterior(codigoUrl)
        setCampoCodigo(codigoUrl)
    }

    useEffect(() => {
        document.title = codigoUrl ? `Pedido ${codigoUrl.toUpperCase()} | Logística UFSCar` : 'Onde está meu pedido? | Logística UFSCar'
    }, [codigoUrl])

    const { dados, carregando, erro, ultimaAtualizacao, atualizandoEmSegundoPlano, recarregarManualmente } = useAcompanhamentoPolling(codigoUrl)

    function aoBuscar(e: React.FormEvent) {
        e.preventDefault()
        const limpo = campoCodigo.trim().toUpperCase()
        if (!limpo) return
        navigate(`/acompanhamento/${encodeURIComponent(limpo)}`)
    }

    const encerrado = dados?.status === 'ENTREGUE' || dados?.status === 'CANCELADO'

    return (
        <S.Container>
            <S.Conteudo>
                <S.Topo>
                    <h1>Onde está meu pedido?</h1>
                    <p>Digite o código de consulta que você recebeu da Logística UFSCar. Não é preciso login.</p>
                </S.Topo>

                <S.FormBusca onSubmit={aoBuscar} role="search">
                    <label htmlFor="codigo-pedido">Código do pedido</label>
                    <div>
                        <input id="codigo-pedido" type="text" value={campoCodigo} onChange={(e) => setCampoCodigo(e.target.value)}
                            placeholder="Ex.: P4X8N2TQ" maxLength={8} autoComplete="off" spellCheck={false}
                            autoCapitalize="characters" aria-describedby="codigo-ajuda" required />
                        <PrimaryButton type="submit" disabled={carregando}>{carregando ? 'Consultando…' : 'Consultar'}</PrimaryButton>
                    </div>
                </S.FormBusca>

                {erro && <S.AvisoErro role="alert">{erro}{dados && " Exibindo os últimos dados recebidos."}</S.AvisoErro>}<Button onClick={recarregarManualmente} disabled={!codigoUrl || carregando || atualizandoEmSegundoPlano}>Atualizar acompanhamento</Button>

                {dados && (
                    <S.Cartao aria-label={`Pedido ${dados.codigo}`}>
                        <S.Resumo>
                            <div>
                                <dt>Status atual</dt>
                                <dd><SeloStatus status={dados.status} /></dd>
                            </div>
                            <div>
                                <dt>Prazo de entrega</dt>
                                <S.Prazo>{formatarData(dados.prazoEntrega)}</S.Prazo>
                            </div>
                        </S.Resumo>
                        <h2>Linha do tempo</h2>
                        <LinhaDoTempo rotulo={`Linha do tempo do pedido ${dados.codigo}`} etapas={etapasPublicas(dados)} />
                    </S.Cartao>
                )}

                <div>
                    <S.Rodape id="codigo-ajuda">O código tem 8 letras e números. Em caso de dúvida, fale com a Logística UFSCar.</S.Rodape>
                    {dados && !encerrado && ultimaAtualizacao && (
                        <S.Rodape>
                            Esta página se atualiza sozinha a cada {dados.intervaloAtualizacaoSegundos} segundos
                            (última verificação às {ultimaAtualizacao.toLocaleTimeString('pt-BR')}).
                        </S.Rodape>
                    )}
                </div>
            </S.Conteudo>
        </S.Container>
    )
}
