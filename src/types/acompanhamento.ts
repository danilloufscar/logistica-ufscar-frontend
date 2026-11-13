import type { StatusPedido } from './pedido'

export type TipoOcorrencia = 'ATRASO' | 'AVARIA' | 'DESTINATARIO_AUSENTE'

export interface ItemAcompanhamento {
    codigoProduto: string
    nomeProduto: string
    quantidade: number
}

export interface EventoTimelineAcompanhamento {
    tipo: 'STATUS' | 'OCORRENCIA'
    dataHora: string
    dataOcorrencia?: string | null
    status?: StatusPedido | null
    statusRotulo?: string | null
    tipoOcorrencia?: TipoOcorrencia | null
    tipoOcorrenciaRotulo?: string | null
    descricao: string
}

export interface AcompanhamentoPedido {
    codigo: string
    clienteNome: string
    enderecoEntrega: string
    prazoEntrega: string
    status: StatusPedido
    statusRotulo: string
    atrasado: boolean
    criadoEm: string
    atualizadoEm: string
    intervaloAtualizacaoSegundos: number
    itens: ItemAcompanhamento[]
    timeline: EventoTimelineAcompanhamento[]
}