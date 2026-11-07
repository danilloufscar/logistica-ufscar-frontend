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
