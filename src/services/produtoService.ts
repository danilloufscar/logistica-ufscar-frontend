import { api, interpretarErroDeCadastro } from './api'
import type { CadastroProduto, CampoCadastroProduto, Produto } from '@/types/produto'

const CAMPOS: readonly CampoCadastroProduto[] = ['codigo', 'nome', 'estoqueMinimo']

export async function listarProdutos(signal: AbortSignal): Promise<Produto[]> {
  const { data } = await api.get<Produto[]>('/produtos', { signal })
  if (!Array.isArray(data)) throw new Error('Resposta de produtos inválida')
  return data
}

export async function cadastrarProduto(dados: CadastroProduto, signal: AbortSignal): Promise<Produto> {
  const { data } = await api.post<Produto>('/produtos', dados, { signal })
  return data
}

export function erroDeCadastroProduto(erro: unknown) {
  return interpretarErroDeCadastro(erro, CAMPOS, 'Não foi possível cadastrar o produto.', {
    codigo: 'CODIGO_PRODUTO_JA_CADASTRADO', campo: 'codigo', mensagem: 'Este código já está cadastrado.',
  })
}
