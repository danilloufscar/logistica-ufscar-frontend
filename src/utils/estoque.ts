import type { SaldoEstoque, TipoMovimentacao } from '@/types/estoque'

/** RN08: quantidades em unidades inteiras, como "42 un.". */
export function unidades(quantidade: number): string {
  return `${quantidade.toLocaleString('pt-BR')} un.`
}

/** Diferença com sinal, como "+3 un." ou "−2 un.". */
export function diferencaEmUnidades(diferenca: number): string {
  const sinal = diferenca > 0 ? '+' : diferenca < 0 ? '−' : ''
  return `${sinal}${unidades(Math.abs(diferenca))}`
}

/** RN04: o alerta vale para saldo igual ou abaixo do mínimo; o texto distingue os dois casos. */
export function situacaoDoEstoque(produto: SaldoEstoque): string {
  if (!produto.abaixoOuNoMinimo) return 'OK'
  return produto.saldo < produto.estoqueMinimo ? 'Abaixo do mínimo' : 'No mínimo'
}

/** RF12: os ajustes aparecem como um único tipo; o sinal da quantidade indica a direção. */
export const ROTULO_MOVIMENTACAO: Record<TipoMovimentacao, string> = {
  ENTRADA: 'Entrada', SAIDA: 'Saída', AJUSTE_ENTRADA: 'Ajuste', AJUSTE_SAIDA: 'Ajuste',
}

export function ehSaida(tipo: TipoMovimentacao): boolean {
  return tipo === 'SAIDA' || tipo === 'AJUSTE_SAIDA'
}

/** Rótulo de produto nas listas de escolha, como no protótipo: "Caixa de papelão M · CX-M". */
export function rotuloProduto(produto: { nome: string; codigo: string }): string {
  return `${produto.nome} · ${produto.codigo}`
}
