import { useCallback, useEffect, useState } from 'react'
import { mensagemDeErro } from '@/services/api'

interface EstadoConsulta<T> {
  dados: T | null
  erro: string | null
  carregando: boolean
}

/**
 * Consulta dados da API. Ao atualizar, os dados anteriores continuam visíveis
 * até a nova resposta; se ela falhar, `erro` é preenchido sem descartá-los.
 * `carregar` deve ser estável (uma função de `services` ou memorizada com useCallback).
 */
export function useConsulta<T>(carregar: (signal: AbortSignal) => Promise<T>, mensagemPadrao: string) {
  const [estado, setEstado] = useState<EstadoConsulta<T>>({ dados: null, erro: null, carregando: true })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    carregar(controller.signal)
      .then((dados) => {
        if (!controller.signal.aborted) setEstado({ dados, erro: null, carregando: false })
      })
      .catch((erro: unknown) => {
        if (controller.signal.aborted) return
        setEstado((atual) => ({ ...atual, erro: mensagemDeErro(erro, mensagemPadrao), carregando: false }))
      })
    return () => controller.abort()
  }, [carregar, mensagemPadrao, tentativa])

  const atualizar = useCallback(() => {
    setEstado((atual) => ({ ...atual, carregando: true }))
    setTentativa((valor) => valor + 1)
  }, [])

  /** Usa dados já recebidos da API (por exemplo, a resposta de uma alteração) sem nova consulta. */
  const substituir = useCallback((dados: T) => setEstado({ dados, erro: null, carregando: false }), [])

  return { ...estado, atualizar, substituir }
}
