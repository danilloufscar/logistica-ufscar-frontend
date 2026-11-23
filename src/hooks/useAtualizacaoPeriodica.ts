import { useEffect, useRef } from 'react'

/** RF16: intervalo de atualização das telas de acompanhamento. */
export const INTERVALO_ATUALIZACAO_MS = 30_000

/**
 * Chama `atualizar` a cada `intervaloMs` enquanto `ativo` for verdadeiro, sem recarregar a página.
 * Ao voltar para a aba depois de um intervalo inteiro escondida, atualiza na hora, pois o navegador
 * pode ter atrasado os disparos enquanto ela estava em segundo plano.
 */
export function useAtualizacaoPeriodica(atualizar: () => void, ativo = true, intervaloMs = INTERVALO_ATUALIZACAO_MS) {
  const ultimaChamada = useRef(Date.now())
  const atual = useRef(atualizar)

  useEffect(() => { atual.current = atualizar }, [atualizar])

  useEffect(() => {
    if (!ativo) return
    ultimaChamada.current = Date.now()
    const disparar = () => {
      ultimaChamada.current = Date.now()
      atual.current()
    }
    const timer = window.setInterval(disparar, intervaloMs)
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === 'visible' && Date.now() - ultimaChamada.current >= intervaloMs) disparar()
    }
    document.addEventListener('visibilitychange', aoMudarVisibilidade)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
    }
  }, [ativo, intervaloMs])
}
