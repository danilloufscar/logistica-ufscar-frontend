import axios from 'axios'
import { api, interpretarErroDeCadastro } from './api'
import type { CampoEntradaEstoque, DadosEntradaEstoque, EntradaEstoque, SaldoEstoque } from '@/types/estoque'
import type { AjusteEstoque, DadosAjusteEstoque, MovimentacaoEstoque } from '@/types/estoque'

export async function ajustarInventario(dados: DadosAjusteEstoque, signal: AbortSignal): Promise<AjusteEstoque> {
  const { data } = await api.post<AjusteEstoque>('/estoque/ajustes', dados, { signal })
  return data
}

export async function listarMovimentacoes(produtoId: number, signal: AbortSignal): Promise<MovimentacaoEstoque[]> {
  const { data } = await api.get<MovimentacaoEstoque[]>(`/estoque/${produtoId}/movimentacoes`, { signal })
  return data
}

export function erroDeAjuste(erro: unknown) {
  const campos: readonly (keyof DadosAjusteEstoque)[] = ['produtoId', 'quantidadeContada', 'justificativa']
  const resultado = interpretarErroDeCadastro(erro, campos, 'Não foi possível ajustar o inventário.')
  if (axios.isAxiosError(erro) && !erro.response) {
    resultado.mensagem = 'Não foi possível confirmar o ajuste. Confira o histórico e o saldo antes de enviar novamente.'
  }
  return resultado
}

const CAMPOS: readonly CampoEntradaEstoque[] = ['produtoId', 'quantidade', 'data']

export async function listarSaldos(signal: AbortSignal): Promise<SaldoEstoque[]> {
  const { data } = await api.get<SaldoEstoque[]>('/estoque', { signal })
  return data
}

/** Entradas mais recentes de todos os produtos, para a tela de registro (RF08). */
export async function listarUltimasEntradas(signal: AbortSignal): Promise<MovimentacaoEstoque[]> {
  const { data } = await api.get<MovimentacaoEstoque[]>('/estoque/entradas', { params: { limite: 5 }, signal })
  return data
}

export async function registrarEntrada(dados: DadosEntradaEstoque, signal: AbortSignal): Promise<EntradaEstoque> {
  const { data } = await api.post<EntradaEstoque>('/estoque/entradas', dados, { signal })
  return data
}

export function erroDeEntrada(erro: unknown) {
  const resultado = interpretarErroDeCadastro(erro, CAMPOS, 'Não foi possível registrar a entrada.', {
    codigo: 'SALDO_LIMITE_EXCEDIDO', campo: 'quantidade',
    mensagem: 'Esta quantidade ultrapassa o limite de saldo do produto.',
  })
  if (axios.isAxiosError(erro) && !erro.response) {
    resultado.mensagem = 'Não foi possível confirmar a entrada. Confira se ela foi registrada antes de enviar novamente.'
  }
  return resultado
}
