import { useEffect, useRef } from 'react'

/** RF16: intervalo de atualização das telas de acompanhamento. */
import { INTERVALO_ATUALIZACAO_MS } from '@/config/atualizacao'
export { INTERVALO_ATUALIZACAO_MS } from '@/config/atualizacao'

/**
 * Chama `atualizar` a cada `intervaloMs` enquanto `ativo` for verdadeiro, sem recarregar a página.
 * Ao voltar para a aba, atualiza na hora, pois o navegador
 * pode ter atrasado os disparos enquanto ela estava em segundo plano.
 */
export function useAtualizacaoPeriodica(atualizar: () => void, ativo = true, intervaloMs = INTERVALO_ATUALIZACAO_MS) {
  const atual = useRef(atualizar)

  useEffect(() => { atual.current = atualizar }, [atualizar])

  useEffect(() => {
    if (!ativo) return
    const disparar = () => {
      atual.current()
    }
    const timer = window.setInterval(disparar, intervaloMs)
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === 'visible') disparar()
    }
    document.addEventListener('visibilitychange', aoMudarVisibilidade)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
    }
  }, [ativo, intervaloMs])
}
