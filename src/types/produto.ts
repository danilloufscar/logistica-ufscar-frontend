export interface Produto {
  id: number
  codigo: string
  nome: string
  estoqueMinimo: number
}

export type CadastroProduto = Omit<Produto, 'id'>

export type CampoCadastroProduto = keyof CadastroProduto
