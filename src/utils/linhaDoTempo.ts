import type { EtapaLinhaDoTempo } from '@/components/LinhaDoTempo'
import type { EventoTimeline } from '@/services/ocorrenciaService'
import type { StatusPedido } from '@/types/pedido'
import { FLUXO_STATUS, ROTULO_STATUS, diaEmSaoPaulo, formatarData, formatarDataHora } from './pedido'

/**
 * Converte a timeline da API (RF13) nas etapas exibidas: status e ocorrências em ordem cronológica
 * e, se pedido, as etapas que ainda faltam até a entrega (RN01).
 */
export function etapasDoPedido(eventos: readonly EventoTimeline[], statusAtual: StatusPedido, mostrarProximas: boolean): EtapaLinhaDoTempo[] {
  const etapas: EtapaLinhaDoTempo[] = eventos.map((evento, indice) => {
    const quando = `${formatarDataHora(evento.dataHora)} · ${evento.usuario.nome}`
    if (evento.tipo === 'OCORRENCIA') {
      const outroDia = evento.dataOcorrencia && evento.dataOcorrencia !== diaEmSaoPaulo(evento.dataHora)
      return {
        chave: `ocorrencia-${indice}-${evento.dataHora}`,
        titulo: `Ocorrência: ${evento.tipoOcorrenciaRotulo ?? 'registro'}`,
        situacao: 'ocorrencia',
        detalhe: outroDia ? `${quando} · ocorrida em ${formatarData(evento.dataOcorrencia!)}` : quando,
        descricao: evento.descricao,
      }
    }
    return {
      chave: `status-${indice}-${evento.dataHora}`,
      titulo: evento.statusRotulo ?? (evento.status ? ROTULO_STATUS[evento.status] : evento.descricao),
      situacao: evento.status === 'CANCELADO' ? 'cancelado' : 'concluido',
      detalhe: quando,
    }
  })

  if (mostrarProximas) {
    const indiceAtual = FLUXO_STATUS.indexOf(statusAtual)
    if (indiceAtual >= 0) {
      FLUXO_STATUS.slice(indiceAtual + 1).forEach((status, posicao) => {
        etapas.push({
          chave: `pendente-${status}`,
          titulo: ROTULO_STATUS[status],
          situacao: posicao === 0 ? 'proximo' : 'pendente',
          detalhe: posicao === 0 ? `Próxima etapa${status === 'DESPACHADO' ? ' · dá baixa no estoque' : ''}` : undefined,
        })
      })
    }
  }
  return etapas
}
