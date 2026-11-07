import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SeloStatus } from '@/components/SeloStatus'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import { Button, Eyebrow, Field, Page } from '@/components/ui'
import { useListagem } from '@/hooks/useListagem'
import { listarPedidos } from '@/services/pedidoService'
import type { ResumoPedido } from '@/types/pedido'
import { FILTROS_STATUS, ROTULO_STATUS, formatarData } from '@/utils/pedido'
import * as S from './styles'

const COLUNAS: readonly Coluna<ResumoPedido>[] = [
  { titulo: 'Código', valor: (pedido) => pedido.codigo, semQuebra: true },
  { titulo: 'Cliente', valor: (pedido) => pedido.cliente.nome },
  {
    titulo: 'Status',
    valor: (pedido) => (
      <S.Selos>
        <SeloStatus status={pedido.status} />
        {pedido.atrasado && <SeloStatus status="ATRASADO" />}
      </S.Selos>
    ),
  },
  {
    titulo: 'Prazo de entrega',
    valor: (pedido) => <S.Prazo $atrasado={pedido.atrasado}>{formatarData(pedido.prazoEntrega)}</S.Prazo>,
    semQuebra: true,
  },
]

const quantidade = (total: number) => `${total} ${total === 1 ? 'pedido' : 'pedidos'}`

export function PedidosPage() {
  const consulta = useListagem(listarPedidos, 'Não foi possível carregar os pedidos.')
  const [parametros, setParametros] = useSearchParams()
  useEffect(() => { document.title = 'Pedidos | SGLU' }, [])

  // Mais recentes primeiro: o id cresce a cada pedido criado.
  const pedidos = useMemo(() => consulta.dados && [...consulta.dados].sort((a, b) => b.id - a.id), [consulta.dados])
  const clientes = useMemo(() => {
    const nomes = new Map<number, string>()
    for (const pedido of pedidos ?? []) nomes.set(pedido.cliente.id, pedido.cliente.nome)
    return [...nomes].map(([id, nome]) => ({ id: String(id), nome })).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [pedidos])

  // Valores inválidos na URL são ignorados.
  const statusUrl = parametros.get('status') ?? ''
  const status = FILTROS_STATUS.find((opcao) => opcao === statusUrl) ?? ''
  const clienteUrl = parametros.get('cliente') ?? ''
  const cliente = clientes.some((opcao) => opcao.id === clienteUrl) ? clienteUrl : ''
  const filtrando = status !== '' || cliente !== ''

  const visiveis = pedidos?.filter((pedido) =>
    (status === '' || (status === 'ATRASADO' ? pedido.atrasado : pedido.status === status))
    && (cliente === '' || String(pedido.cliente.id) === cliente))

  function filtrar(nome: 'status' | 'cliente', valor: string) {
    setParametros((atuais) => {
      const novos = new URLSearchParams(atuais)
      if (valor) novos.set(nome, valor)
      else novos.delete(nome)
      return novos
    }, { replace: true })
  }

  const limparFiltros = () => setParametros({}, { replace: true })
  const total = pedidos?.length ?? 0

  return (
    <Page aria-labelledby="pedidos-titulo">
      <Eyebrow>Operação</Eyebrow>
      <h1 id="pedidos-titulo">Pedidos</h1>

      <S.Filtros role="search" aria-label="Filtrar pedidos">
        <Field>
          <label htmlFor="filtro-status">Status</label>
          <select id="filtro-status" value={status} onChange={(event) => filtrar('status', event.target.value)}>
            <option value="">Todos</option>
            {FILTROS_STATUS.map((opcao) => <option key={opcao} value={opcao}>{ROTULO_STATUS[opcao]}</option>)}
          </select>
        </Field>
        <Field>
          <label htmlFor="filtro-cliente">Cliente</label>
          <select id="filtro-cliente" value={cliente} onChange={(event) => filtrar('cliente', event.target.value)}>
            <option value="">Todos</option>
            {clientes.map((opcao) => <option key={opcao.id} value={opcao.id}>{opcao.nome}</option>)}
          </select>
        </Field>
        <Button type="button" onClick={limparFiltros}>Limpar filtros</Button>
      </S.Filtros>

      <TabelaDados
        consulta={{ ...consulta, dados: pedidos }}
        itens={visiveis}
        colunas={COLUNAS}
        emAlerta={(pedido) => pedido.atrasado}
        textos={filtrando && total > 0 ? {
          carregando: 'Carregando pedidos…',
          vazio: 'Nenhum pedido encontrado',
          dicaVazio: 'Nenhum pedido corresponde aos filtros selecionados.',
          legenda: quantidade,
        } : {
          carregando: 'Carregando pedidos…',
          vazio: 'Nenhum pedido cadastrado',
          dicaVazio: 'Os pedidos criados aparecerão aqui.',
          legenda: quantidade,
        }}
        acaoVazio={filtrando && total > 0 && <Button type="button" onClick={limparFiltros}>Limpar filtros</Button>}
        rodape={`${filtrando ? `${visiveis?.length ?? 0} de ${quantidade(total)}` : quantidade(total)} · mais recentes primeiro`}
      />
    </Page>
  )
}
