import { useCallback, useEffect, useMemo, useRef, type ChangeEvent, type ReactNode } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, ButtonLink, ErrorText, Field, Oculto, Page, PrimaryButton, TextButton } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { listarClientes } from '@/services/clienteService'
import { buscarPedido, criarPedido, editarPedido, erroDeFormularioPedido } from '@/services/pedidoService'
import { listarProdutos } from '@/services/produtoService'
import type { Cliente } from '@/types/cliente'
import type { DadosPedido, Pedido } from '@/types/pedido'
import type { Produto } from '@/types/produto'
import { hojeEmSaoPaulo, idDePedido, permiteAlteracao, ROTULO_STATUS } from '@/utils/pedido'
import { EstadoConsulta, PedidoNaoEncontrado } from './EstadoConsulta'
import * as S from './styles'

// Os campos guardam texto; a conversão para números acontece no envio.
interface ValoresPedido {
  clienteId: string
  prazoEntrega: string
  enderecoEntrega: string
  itens: { produtoId: string; quantidade: string }[]
}

const NOVO_PEDIDO: ValoresPedido = { clienteId: '', prazoEntrega: '', enderecoEntrega: '', itens: [{ produtoId: '', quantidade: '' }] }
const MAIOR_QUANTIDADE = 2_147_483_647
const MAXIMO_ITENS = 100

function paraDados(valores: ValoresPedido): DadosPedido {
  return {
    clienteId: Number(valores.clienteId),
    prazoEntrega: valores.prazoEntrega,
    enderecoEntrega: valores.enderecoEntrega,
    itens: valores.itens.map((item) => ({ produtoId: Number(item.produtoId), quantidade: Number(item.quantidade) })),
  }
}

function paraValores(pedido: Pedido): ValoresPedido {
  return {
    clienteId: String(pedido.cliente.id),
    prazoEntrega: pedido.prazoEntrega,
    enderecoEntrega: pedido.enderecoEntrega,
    itens: pedido.itens.map((item) => ({ produtoId: String(item.produto.id), quantidade: String(item.quantidade) })),
  }
}

/** RF04 */
export function NovoPedidoPage() {
  useEffect(() => { document.title = 'Novo pedido | SGLU' }, [])
  return (
    <Page aria-labelledby="pedido-titulo">
      <S.Trilha aria-label="Você está em"><Link to="/pedidos">Pedidos</Link> / Novo pedido</S.Trilha>
      <h1 id="pedido-titulo">Novo pedido</h1>
      <ComCadastros>{(cadastros) => <FormularioPedido {...cadastros} />}</ComCadastros>
    </Page>
  )
}

/** RF05 */
export function EditarPedidoPage() {
  const id = idDePedido(useParams().id)
  useEffect(() => { document.title = 'Editar pedido | SGLU' }, [])
  return (
    <Page aria-labelledby="pedido-titulo">
      <S.Trilha aria-label="Você está em">
        <Link to="/pedidos">Pedidos</Link> / {id ? <Link to={`/pedidos/${id}`}>#{id}</Link> : 'Pedido'} / Editar
      </S.Trilha>
      <h1 id="pedido-titulo">Editar pedido{id ? ` #${id}` : ''}</h1>
      {id ? <EdicaoDoPedido key={id} id={id} /> : <PedidoNaoEncontrado />}
    </Page>
  )
}

function EdicaoDoPedido({ id }: { id: number }) {
  const carregar = useCallback((signal: AbortSignal) => buscarPedido(id, signal), [id])
  const consulta = useConsulta(carregar, 'Não foi possível carregar o pedido.')
  const pedido = consulta.dados

  if (!pedido) {
    return <EstadoConsulta textoCarregando="Carregando pedido…" erro={consulta.erro}
      carregando={consulta.carregando} aoTentarNovamente={consulta.atualizar} />
  }
  if (!permiteAlteracao(pedido.status)) {
    return (
      <S.Estado>
        <h2>Este pedido não pode mais ser editado</h2>
        <p>O pedido está com status {ROTULO_STATUS[pedido.status]}. Só é possível editar pedidos Criados ou Em separação.</p>
        <ButtonLink to={`/pedidos/${id}`}>Ver pedido</ButtonLink>
      </S.Estado>
    )
  }
  return <ComCadastros>{(cadastros) => <FormularioPedido {...cadastros} pedido={pedido} />}</ComCadastros>
}

interface Cadastros {
  clientes: Cliente[]
  produtos: Produto[]
}

/** Carrega clientes e produtos, que o formulário oferece para escolha. */
function ComCadastros({ children }: { children: (cadastros: Cadastros) => ReactNode }) {
  const clientes = useConsulta(listarClientes, 'Não foi possível carregar os clientes.')
  const produtos = useConsulta(listarProdutos, 'Não foi possível carregar os produtos.')

  if (!clientes.dados || !produtos.dados) {
    const tentarNovamente = () => {
      if (!clientes.dados) clientes.atualizar()
      if (!produtos.dados) produtos.atualizar()
    }
    return <EstadoConsulta textoCarregando="Carregando clientes e produtos…" erro={clientes.erro ?? produtos.erro}
      carregando={clientes.carregando || produtos.carregando} aoTentarNovamente={tentarNovamente} />
  }
  if (clientes.dados.length === 0 || produtos.dados.length === 0) {
    const falta = clientes.dados.length === 0 ? 'cliente' : 'produto'
    return (
      <S.Estado>
        <h2>Nenhum {falta} cadastrado</h2>
        <p>Cadastre ao menos um cliente e um produto antes de criar pedidos.</p>
        <ButtonLink to={falta === 'cliente' ? '/clientes' : '/produtos'}>Cadastrar {falta}</ButtonLink>
      </S.Estado>
    )
  }
  return children({ clientes: clientes.dados, produtos: produtos.dados })
}

function FormularioPedido({ clientes, produtos, pedido }: Cadastros & { pedido?: Pedido }) {
  const navigate = useNavigate()
  const hoje = useMemo(() => hojeEmSaoPaulo(), [])
  const inicial = useMemo(() => (pedido ? paraValores(pedido) : NOVO_PEDIDO), [pedido])
  const form = useForm<ValoresPedido>({ defaultValues: inicial, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, control, getValues, setValue, formState: { errors, isSubmitting, isSubmitted } } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'itens' })
  const botaoAdicionar = useRef<HTMLButtonElement>(null)
  const destino = pedido ? `/pedidos/${pedido.id}` : '/pedidos'

  const { erroGeral, limparErroGeral, aoEnviar } = useEnvioCadastro(form, {
    valoresIniciais: inicial,
    primeiroCampo: 'clienteId',
    limparAposSucesso: false,
    enviar: (valores, signal) => (pedido
      ? editarPedido(pedido.id, paraDados(valores), signal)
      : criarPedido(paraDados(valores), signal)),
    interpretarErro: erroDeFormularioPedido,
    mensagemSucesso: (salvo) => (pedido ? 'Pedido atualizado.' : `Pedido criado. Código de consulta: ${salvo.codigo}.`),
    aoCadastrar: (salvo) => navigate(`/pedidos/${salvo.id}`, { replace: true }),
  })

  // O endereço de entrega acompanha o cliente escolhido, a menos que tenha sido
  // digitado um endereço próprio (diferente do endereço de todos os clientes).
  function preencherEndereco(event: ChangeEvent<HTMLSelectElement>) {
    const atual = getValues('enderecoEntrega').trim()
    if (atual && !clientes.some((cliente) => cliente.endereco.trim() === atual)) return
    const escolhido = clientes.find((cliente) => String(cliente.id) === event.target.value)
    setValue('enderecoEntrega', escolhido?.endereco ?? '', { shouldValidate: isSubmitted, shouldDirty: true })
  }

  function removerItem(indice: number) {
    remove(indice)
    // O botão "Remover" some com a linha; o foco vai para um ponto estável do formulário.
    botaoAdicionar.current?.focus()
  }

  const outrosProdutos = (indice: number) => fields.map((_, i) => `itens.${i}.produtoId` as const).filter((_, i) => i !== indice)
  const erroItens = errors.itens?.message ?? errors.itens?.root?.message

  return (
    <S.FormCard>
      <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
        {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
        <fieldset disabled={isSubmitting}>
          <S.Linha>
            <Field>
              <label htmlFor="pedido-cliente">Cliente<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
              <select id="pedido-cliente" aria-required="true" aria-invalid={Boolean(errors.clienteId)}
                aria-describedby={errors.clienteId ? 'pedido-cliente-erro' : undefined}
                {...register('clienteId', { required: 'Selecione o cliente.', onChange: preencherEndereco })}>
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => <option key={cliente.id} value={String(cliente.id)}>{cliente.nome}</option>)}
              </select>
              {errors.clienteId && <ErrorText id="pedido-cliente-erro" role="alert">{errors.clienteId.message}</ErrorText>}
            </Field>
            <Field>
              <label htmlFor="pedido-prazo">Prazo de entrega<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
              <input id="pedido-prazo" type="date" min={pedido ? undefined : hoje} aria-required="true"
                aria-invalid={Boolean(errors.prazoEntrega)} aria-describedby={errors.prazoEntrega ? 'pedido-prazo-erro' : undefined}
                {...register('prazoEntrega', {
                  required: 'Informe o prazo de entrega.',
                  // Na edição, um prazo já vencido pode ser mantido; um prazo novo não pode estar no passado.
                  validate: (valor) => valor === pedido?.prazoEntrega || valor >= hoje || 'O prazo de entrega não pode ser anterior a hoje.',
                })} />
              {errors.prazoEntrega && <ErrorText id="pedido-prazo-erro" role="alert">{errors.prazoEntrega.message}</ErrorText>}
            </Field>
          </S.Linha>

          <Field>
            <label htmlFor="pedido-endereco">Endereço de entrega<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="pedido-endereco" placeholder="Rua, número – Cidade/UF" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.enderecoEntrega)} aria-describedby={errors.enderecoEntrega ? 'pedido-endereco-erro' : undefined}
              {...register('enderecoEntrega', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Informe o endereço de entrega.',
                maxLength: { value: 500, message: 'O endereço deve ter até 500 caracteres.' },
              })} />
            {errors.enderecoEntrega && <ErrorText id="pedido-endereco-erro" role="alert">{errors.enderecoEntrega.message}</ErrorText>}
          </Field>

          <S.Itens>
            <legend>Itens<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></legend>
            {fields.map((field, indice) => {
              const erroProduto = errors.itens?.[indice]?.produtoId
              const erroQuantidade = errors.itens?.[indice]?.quantidade
              const idBase = `pedido-item-${indice}`
              return (
                <S.LinhaItem key={field.id}>
                  <Field>
                    <label htmlFor={`${idBase}-produto`}>Produto<Oculto> do item {indice + 1}</Oculto></label>
                    <select id={`${idBase}-produto`} aria-required="true" aria-invalid={Boolean(erroProduto)}
                      aria-describedby={erroProduto ? `${idBase}-produto-erro` : undefined}
                      {...register(`itens.${indice}.produtoId`, {
                        required: 'Selecione o produto.',
                        validate: (valor, valores) =>
                          valores.itens.findIndex((item) => item.produtoId === valor) === indice || 'Este produto já está no pedido.',
                        deps: outrosProdutos(indice),
                      })}>
                      <option value="">Selecione um produto</option>
                      {produtos.map((produto) => (
                        <option key={produto.id} value={String(produto.id)}>{produto.nome} ({produto.codigo})</option>
                      ))}
                    </select>
                    {erroProduto && <ErrorText id={`${idBase}-produto-erro`} role="alert">{erroProduto.message}</ErrorText>}
                  </Field>
                  <Field>
                    <label htmlFor={`${idBase}-quantidade`}>Quantidade<Oculto> do item {indice + 1}</Oculto></label>
                    <input id={`${idBase}-quantidade`} inputMode="numeric" autoComplete="off" aria-required="true"
                      aria-invalid={Boolean(erroQuantidade)} aria-describedby={erroQuantidade ? `${idBase}-quantidade-erro` : undefined}
                      {...register(`itens.${indice}.quantidade`, {
                        setValueAs: (valor: string) => valor.trim(),
                        required: 'Informe a quantidade.',
                        // RN08: unidades inteiras.
                        pattern: { value: /^\d+$/, message: 'Use um número inteiro.' },
                        validate: (valor) => (Number(valor) > 0 && Number(valor) <= MAIOR_QUANTIDADE) || 'Informe uma quantidade maior que zero.',
                      })} />
                    {erroQuantidade && <ErrorText id={`${idBase}-quantidade-erro`} role="alert">{erroQuantidade.message}</ErrorText>}
                  </Field>
                  <TextButton type="button" onClick={() => removerItem(indice)} disabled={fields.length === 1}
                    aria-label={`Remover item ${indice + 1}`}>
                    Remover
                  </TextButton>
                </S.LinhaItem>
              )
            })}
            {erroItens && <ErrorText role="alert">{erroItens}</ErrorText>}
            <Button ref={botaoAdicionar} type="button"
              disabled={fields.length >= Math.min(produtos.length, MAXIMO_ITENS)}
              onClick={() => append({ produtoId: '', quantidade: '' })}>
              + Adicionar item
            </Button>
          </S.Itens>
        </fieldset>

        <S.Rodape>
          <p>
            {pedido
              ? 'As alterações só são permitidas antes do despacho.'
              : 'O pedido é criado com status Criado e recebe um código de consulta para o cliente. Só pode ser editado ou cancelado antes do despacho.'}
          </p>
          <S.Acoes>
            <Button type="button" disabled={isSubmitting} onClick={() => navigate(destino)}>
              {pedido ? 'Descartar alterações' : 'Cancelar'}
            </Button>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando…' : pedido ? 'Salvar alterações' : 'Criar pedido'}
            </PrimaryButton>
          </S.Acoes>
        </S.Rodape>
      </S.Form>
    </S.FormCard>
  )
}
