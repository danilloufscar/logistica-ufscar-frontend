import { ButtonLink } from '@/components/ui'
import { Table } from '@/components/TabelaDados/styles'
import type { ItemSemEstoque } from '@/types/pedido'
import * as S from './styles'

export function AlertaEstoque({ itens }: { itens: ItemSemEstoque[] }) {
  return (
    <S.AlertaEstoque role="alert" aria-labelledby="despacho-bloqueado">
      <h2 id="despacho-bloqueado">Despacho bloqueado por falta de estoque</h2>
      <p>Nenhum item foi baixado. Confira os produtos abaixo, registre as entradas necessárias e tente despachar novamente.</p>
      <Table>
        <caption>Estoque conferido na última tentativa de despacho</caption>
        <thead><tr><th scope="col">Produto</th><th scope="col">Código</th><th scope="col">Solicitado</th><th scope="col">Disponível</th><th scope="col">Faltante</th></tr></thead>
        <tbody>{itens.map(item => (
          <tr key={item.produtoId}>
            <th scope="row" data-label="Produto">{item.nome}</th>
            <td data-label="Código">{item.codigo}</td>
            <td data-label="Solicitado">{item.solicitado.toLocaleString('pt-BR')}</td>
            <td data-label="Disponível">{item.disponivel.toLocaleString('pt-BR')}</td>
            <td data-label="Faltante">{item.faltante.toLocaleString('pt-BR')}</td>
          </tr>
        ))}</tbody>
      </Table>
      <S.Acoes><ButtonLink to="/estoque/entradas">Registrar entrada</ButtonLink><ButtonLink to="/estoque">Consultar saldos</ButtonLink></S.Acoes>
    </S.AlertaEstoque>
  )
}
