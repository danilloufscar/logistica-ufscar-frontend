export type StatusPedido = 'CRIADO' | 'EM_SEPARACAO' | 'DESPACHADO' | 'EM_TRANSITO' | 'ENTREGUE' | 'CANCELADO'

/** Status exibidos na interface: os do pedido e o alerta de atraso, informado pela API. */
export type StatusExibido = StatusPedido | 'ATRASADO'

/** Item de `GET /api/pedidos`. */
export interface ResumoPedido {
  id: number
  /** Código de consulta do pedido (RN06): 8 caracteres alfanuméricos, exibido na lista (RF06). */
  codigo: string
  cliente: { id: number; nome: string }
  status: StatusPedido
  /** Data no formato AAAA-MM-DD. */
  prazoEntrega: string
  /** Prazo vencido sem entrega nem cancelamento, calculado pelo backend. */
  atrasado: boolean
}

export interface ItemPedido {
  produto: { id: number; codigo: string; nome: string }
  quantidade: number
}

/** Mudança de status com data, hora e usuário (RF07). */
export interface RegistroHistorico {
  status: StatusPedido
  /** Data e hora em ISO 8601 (UTC). */
  dataHora: string
  usuario: { id: number; nome: string }
}

/** Resposta de `GET /api/pedidos/{id}` e das alterações do pedido. */
export interface Pedido extends ResumoPedido {
  enderecoEntrega: string
  criadoEm: string
  itens: ItemPedido[]
  historico: RegistroHistorico[]
}

/** Corpo da criação (RF04) e da edição (RF05). */
export interface DadosPedido {
  clienteId: number
  enderecoEntrega: string
  /** Data no formato AAAA-MM-DD. */
  prazoEntrega: string
  itens: { produtoId: number; quantidade: number }[]
}

/** Campos do formulário de pedido que podem receber erros da API. */
export type CampoPedido =
  | 'clienteId' | 'prazoEntrega' | 'enderecoEntrega' | 'itens'
  | `itens.${number}.produtoId` | `itens.${number}.quantidade`
