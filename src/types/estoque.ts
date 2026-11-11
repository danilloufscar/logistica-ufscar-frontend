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
export interface SaldoEstoque {
  id: number
  codigo: string
  nome: string
  saldo: number
  estoqueMinimo: number
  abaixoOuNoMinimo: boolean
}
