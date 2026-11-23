import type { StatusPedido } from './pedido'

/** Mudança de status exibida no Portal: sem usuário nem ocorrências internas. */
export interface EtapaAcompanhamento {
    status: StatusPedido
    statusRotulo: string
    dataHora: string
}

/** Resposta pública de `GET /api/acompanhamento/{codigo}` (RF17): só status, prazo e linha do tempo. */
export interface AcompanhamentoPedido {
    codigo: string
    status: StatusPedido
    statusRotulo: string
    prazoEntrega: string
    atualizadoEm: string
    intervaloAtualizacaoSegundos: number
    timeline: EtapaAcompanhamento[]
}
