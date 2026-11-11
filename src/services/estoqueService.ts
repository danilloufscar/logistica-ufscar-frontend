import axios from 'axios'
import { api, interpretarErroDeCadastro } from './api'
import type { CampoEntradaEstoque, DadosEntradaEstoque, EntradaEstoque } from '@/types/estoque'

const CAMPOS: readonly CampoEntradaEstoque[] = ['produtoId', 'quantidade', 'data']

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
