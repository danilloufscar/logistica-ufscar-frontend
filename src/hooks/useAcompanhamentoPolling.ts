import { useCallback, useEffect, useRef, useState } from 'react'
import { consultarAcompanhamento } from '@/services/acompanhamentoService'
import type { AcompanhamentoPedido } from '@/types/acompanhamento'
import { mensagemDeErro } from '@/services/api'

import { INTERVALO_ATUALIZACAO_MS } from './useAtualizacaoPeriodica'
export function useAcompanhamentoPolling(codigo: string) {
  const chave = codigo.trim().toUpperCase()
  const [estado, setEstado] = useState<{ chave: string; dados: AcompanhamentoPedido | null; carregando: boolean; erro: string | null; ultimaAtualizacao: Date | null }>({ chave: '', dados: null, carregando: false, erro: null, ultimaAtualizacao: null })
  const executar = useRef<(() => void) | null>(null)
  useEffect(() => {
    let ativo = true
    let controller: AbortController | null = null
    let encerrado = false
    async function consultar() {
      if (!chave || controller || !ativo) return
      const atual = new AbortController()
      controller = atual
      setEstado(anterior => anterior.chave === chave ? { ...anterior, carregando: true } : { chave, dados: null, carregando: true, erro: null, ultimaAtualizacao: null })
      try {
        const dados = await consultarAcompanhamento(chave, atual.signal)
        if (!ativo || atual.signal.aborted) return
        encerrado = dados.status === 'ENTREGUE' || dados.status === 'CANCELADO'
        setEstado({ chave, dados, carregando: false, erro: null, ultimaAtualizacao: new Date() })
      } catch (erro) {
        if (ativo && !atual.signal.aborted) setEstado(anterior => ({ ...anterior, carregando: false, erro: mensagemDeErro(erro, 'Não foi possível consultar o acompanhamento do pedido.') }))
      } finally { if (controller === atual) controller = null }
    }
    executar.current = () => { void consultar() }
    void consultar()
    const timer = window.setInterval(() => { if (!encerrado) void consultar() }, INTERVALO_ATUALIZACAO_MS)
    return () => { ativo = false; executar.current = null; window.clearInterval(timer); controller?.abort() }
  }, [chave])
  const atual = estado.chave === chave ? estado : { dados: null, carregando: Boolean(chave), erro: null, ultimaAtualizacao: null }
  const recarregarManualmente = useCallback(() => executar.current?.(), [])
  return { dados: atual.dados, erro: atual.erro, ultimaAtualizacao: atual.ultimaAtualizacao,
    carregando: atual.carregando && !atual.dados, atualizandoEmSegundoPlano: atual.carregando && !!atual.dados, recarregarManualmente }
}
