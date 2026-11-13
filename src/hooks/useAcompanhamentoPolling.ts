import { useCallback, useEffect, useRef, useState } from 'react'
import { consultarAcompanhamento } from '@/services/acompanhamentoService'
import type { AcompanhamentoPedido } from '@/types/acompanhamento'
import { mensagemDeErro } from '@/services/api'

export const INTERVALO_ATUALIZACAO_MS = 30_000

export function useAcompanhamentoPolling(codigo: string) {
    const [dados, setDados] = useState<AcompanhamentoPedido | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [atualizandoEmSegundoPlano, setAtualizandoEmSegundoPlano] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)

    const abortRef = useRef<AbortController | null>(null)

    const buscar = useCallback(async (silencioso: boolean) => {
        const codigoLimpo = codigo.trim()
        if (!codigoLimpo) {
            setDados(null)
            setErro(null)
            return
        }

        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        if (silencioso) {
            setAtualizandoEmSegundoPlano(true)
        } else {
            setCarregando(true)
            setErro(null)
        }

        try {
            const resposta = await consultarAcompanhamento(codigoLimpo, controller.signal)
            if (controller.signal.aborted) return
            setDados(resposta)
            setErro(null)
            setUltimaAtualizacao(new Date())
        } catch (e) {
            if (controller.signal.aborted) return
            const msg = mensagemDeErro(e, 'Não foi possível consultar o acompanhamento do pedido.')
            if (!silencioso) {
                setDados(null)
            }
            setErro(msg)
        } finally {
            if (abortRef.current === controller) {
                abortRef.current = null
                setCarregando(false)
                setAtualizandoEmSegundoPlano(false)
            }
        }
    }, [codigo])

    useEffect(() => {
        void buscar(false)
        return () => abortRef.current?.abort()
    }, [buscar])

    const encerrado = dados?.status === 'ENTREGUE' || dados?.status === 'CANCELADO'

    useEffect(() => {
        const codigoLimpo = codigo.trim()
        if (!codigoLimpo || encerrado) return

        const timer = window.setInterval(() => {
            void buscar(true)
        }, INTERVALO_ATUALIZACAO_MS)

        return () => window.clearInterval(timer)
    }, [codigo, encerrado, buscar])

    return {
        dados,
        carregando,
        atualizandoEmSegundoPlano,
        erro,
        ultimaAtualizacao,
        recarregarManualmente: () => buscar(false),
    }
}