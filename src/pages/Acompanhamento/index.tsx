import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SeloStatus } from '@/components/SeloStatus'
import { PrimaryButton } from '@/components/ui'
import { useAcompanhamentoPolling } from '@/hooks/useAcompanhamentoPolling'
import { formatarData, formatarDataHora } from '@/utils/pedido'
import * as S from './styles'

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
        document.title = codigoUrl
            ? `Acompanhar Pedido ${codigoUrl.toUpperCase()} | SGLU`
            : 'Acompanhar Pedido | SGLU'
    }, [codigoUrl])

    const {
        dados,
        carregando,
        atualizandoEmSegundoPlano,
        erro,
        ultimaAtualizacao,
    } = useAcompanhamentoPolling(codigoUrl)

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
                    <h1>Acompanhamento de Pedido</h1>
                    <Link to="/login">Área restrita</Link>
                </S.Topo>

                <S.Cartao aria-labelledby="busca-titulo">
                    <h2 id="busca-titulo">Consultar pedido</h2>
                    <S.FormBusca onSubmit={aoBuscar}>
                        <label>
                            Código de consulta
                            <input
                                type="text"
                                value={campoCodigo}
                                onChange={(e) => setCampoCodigo(e.target.value)}
                                placeholder="Ex.: K7QM2XPA"
                                maxLength={16}
                                required
                            />
                        </label>
                        <PrimaryButton type="submit" disabled={carregando}>
                            {carregando ? 'Consultando…' : 'Consultar'}
                        </PrimaryButton>
                    </S.FormBusca>
                </S.Cartao>

                {erro && <S.AvisoErro role="alert">{erro}</S.AvisoErro>}

                {dados && (
                    <>
                        <S.BarraStatusAtualizacao role="status" aria-live="polite">
                            <span>
                                {encerrado
                                    ? 'Pedido encerrado — atualização automática finalizada.'
                                    : atualizandoEmSegundoPlano
                                        ? 'Atualizando dados do pedido…'
                                        : `Atualização automática ativa a cada ${dados.intervaloAtualizacaoSegundos} segundos.`}
                            </span>
                            {ultimaAtualizacao && (
                                <span>
                                    Última verificação: {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
                                </span>
                            )}
                        </S.BarraStatusAtualizacao>

                        <S.Cartao aria-labelledby="resumo-titulo">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                                <h2 id="resumo-titulo" style={{ margin: 0 }}>Pedido {dados.codigo}</h2>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <SeloStatus status={dados.status} />
                                    {dados.atrasado && <SeloStatus status="ATRASADO" />}
                                </div>
                            </div>

                            <S.GradeDados>
                                <div>
                                    <dt>Cliente</dt>
                                    <dd>{dados.clienteNome}</dd>
                                </div>
                                <div>
                                    <dt>Prazo de entrega</dt>
                                    <dd>{formatarData(dados.prazoEntrega)}</dd>
                                </div>
                                <div>
                                    <dt>Endereço de entrega</dt>
                                    <dd>{dados.enderecoEntrega}</dd>
                                </div>
                            </S.GradeDados>
                        </S.Cartao>

                        <S.Cartao aria-labelledby="timeline-titulo">
                            <h2 id="timeline-titulo">Histórico e ocorrências</h2>
                            <S.ListaTimeline>
                                {dados.timeline.map((evento, idx) => (
                                    <li key={`${evento.tipo}-${evento.dataHora}-${idx}`} data-tipo={evento.tipo}>
                                        <strong>
                                            {evento.tipo === 'STATUS'
                                                ? (evento.statusRotulo ?? evento.descricao)
                                                : `Ocorrência: ${evento.tipoOcorrenciaRotulo ?? 'Registro'}`}
                                        </strong>
                                        {evento.tipo === 'OCORRENCIA' && <div>{evento.descricao}</div>}
                                        <span>
                                            {formatarDataHora(evento.dataHora)}
                                            {evento.dataOcorrencia ? ` · Data da ocorrência: ${formatarData(evento.dataOcorrencia)}` : ''}
                                        </span>
                                    </li>
                                ))}
                            </S.ListaTimeline>
                        </S.Cartao>
                    </>
                )}
            </S.Conteudo>
        </S.Container>
    )
}