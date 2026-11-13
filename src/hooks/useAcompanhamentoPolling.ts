import { useCallback, useEffect, useRef, useState } from 'react'
import { consultarAcompanhamento } from '@/services/acompanhamentoService'
import type { AcompanhamentoPedido } from '@/types/acompanhamento'
import { mensagemDeErro } from '@/services/api'

export const INTERVALO_ATUALIZACAO_MS = 30_000

export function useAcompanhamentoPolling(codigo: string) {
    const codigoLimpo = codigo.trim()
    const [codigoAnterior, setCodigoAnterior] = useState(codigoLimpo)

    const [dados, setDados] = useState<AcompanhamentoPedido | null>(null)
    const [carregando, setCarregando] = useState(Boolean(codigoLimpo))
    const [atualizandoEmSegundoPlano, setAtualizandoEmSegundoPlano] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)

    if (codigoLimpo !== codigoAnterior) {
        setCodigoAnterior(codigoLimpo)
        setDados(null)
        setErro(null)
        setCarregando(Boolean(codigoLimpo))
    }

    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        if (!codigoLimpo) return

        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        consultarAcompanhamento(codigoLimpo, controller.signal)
            .then((resposta) => {
                if (controller.signal.aborted) return
                setDados(resposta)
                setErro(null)
                setUltimaAtualizacao(new Date())
            })
            .catch((e) => {
                if (controller.signal.aborted) return
                setDados(null)
                setErro(mensagemDeErro(e, 'Não foi possível consultar o acompanhamento do pedido.'))
            })
            .finally(() => {
                if (abortRef.current === controller) {
                    abortRef.current = null
                    setCarregando(false)
                }
            })

        return () => controller.abort()
    }, [codigoLimpo])

    const encerrado = dados?.status === 'ENTREGUE' || dados?.status === 'CANCELADO'

    useEffect(() => {
        if (!codigoLimpo || encerrado) return

        const timer = window.setInterval(() => {
            abortRef.current?.abort()
            const controller = new AbortController()
            abortRef.current = controller
            setAtualizandoEmSegundoPlano(true)

            consultarAcompanhamento(codigoLimpo, controller.signal)
                .then((resposta) => {
                    if (controller.signal.aborted) return
                    setDados(resposta)
                    setErro(null)
                    setUltimaAtualizacao(new Date())
                })
                .catch((e) => {
                    if (controller.signal.aborted) return
                    setErro(mensagemDeErro(e, 'Não foi possível consultar o acompanhamento do pedido.'))
                })
                .finally(() => {
                    if (abortRef.current === controller) {
                        abortRef.current = null
                        setAtualizandoEmSegundoPlano(false)
                    }
                })
        }, INTERVALO_ATUALIZACAO_MS)

        return () => window.clearInterval(timer)
    }, [codigoLimpo, encerrado])

    const recarregarManualmente = useCallback(() => {
        if (!codigoLimpo) return

        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        setCarregando(true)
        setErro(null)

        consultarAcompanhamento(codigoLimpo, controller.signal)
            .then((resposta) => {
                if (controller.signal.aborted) return
                setDados(resposta)
                setErro(null)
                setUltimaAtualizacao(new Date())
            })
            .catch((e) => {
                if (controller.signal.aborted) return
                setDados(null)
                setErro(mensagemDeErro(e, 'Não foi possível consultar o acompanhamento do pedido.'))
            })
            .finally(() => {
                if (abortRef.current === controller) {
                    abortRef.current = null
                    setCarregando(false)
                }
            })
    }, [codigoLimpo])

    return {
        dados,
        carregando,
        atualizandoEmSegundoPlano,
        erro,
        ultimaAtualizacao,
        recarregarManualmente,
    }
}