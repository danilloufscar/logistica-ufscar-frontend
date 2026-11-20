export interface DadosEntradaEstoque {
  produtoId: number
  quantidade: number
  data: string
}

export interface EntradaEstoque {
  id: number
  produto: { id: number; codigo: string; nome: string }
  tipo: 'ENTRADA'
  quantidade: number
  data: string
  registradoEm: string
  usuario: { id: number; nome: string }
  saldoAtual: number
}

export type CampoEntradaEstoque = keyof DadosEntradaEstoque
export interface DadosAjusteEstoque {
  produtoId: number
  quantidadeContada: number
  justificativa: string
}

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA' | 'AJUSTE_ENTRADA' | 'AJUSTE_SAIDA'

export interface AjusteEstoque {
  id: number
  produtoId: number
  produtoNome: string
  tipo: TipoMovimentacao
  quantidadeAjustada: number
  saldoAnterior: number
  saldoAtual: number
  justificativa: string
  data: string
  registradoEm: string
  usuarioResponsavel: string
}

export interface MovimentacaoEstoque {
  id: number
  produtoId: number
  produtoCodigo: string
  produtoNome: string
  tipo: TipoMovimentacao
  quantidade: number
  data: string
  registradoEm: string
  usuarioResponsavel: string
  pedidoId: number | null
  justificativa: string | null
}

export interface SaldoEstoque {
  id: number
  codigo: string
  nome: string
  saldo: number
  estoqueMinimo: number
  abaixoOuNoMinimo: boolean
}
