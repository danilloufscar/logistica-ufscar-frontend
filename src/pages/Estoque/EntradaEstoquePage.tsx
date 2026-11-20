import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Table } from '@/components/TabelaDados/styles'
import { Button, ButtonLink, ErrorText, Field, Obrigatorio, Page, PrimaryButton, Trilha } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { erroDeEntrada, listarSaldos, listarUltimasEntradas, registrarEntrada } from '@/services/estoqueService'
import type { MovimentacaoEstoque, SaldoEstoque } from '@/types/estoque'
import { rotuloProduto, unidades } from '@/utils/estoque'
import { formatarData, hojeEmSaoPaulo } from '@/utils/pedido'
import * as S from './styles'

interface ValoresEntrada { produtoId: string; quantidade: string; data: string }

const MAIOR_QUANTIDADE = 2_147_483_647
const quantidadeValida = (valor: string) => /^\d+$/.test(valor.trim()) && Number(valor) > 0 && Number(valor) <= MAIOR_QUANTIDADE

/** Tela 8: entrada de produtos no armazém (RF08). */
export function EntradaEstoquePage() {
  useEffect(() => { document.title = 'Registrar entrada | SGLU' }, [])
  const saldos = useConsulta(listarSaldos, 'Não foi possível carregar os produtos.')
  const entradas = useConsulta(listarUltimasEntradas, 'Não foi possível carregar as últimas entradas.')
  const { atualizar: atualizarSaldos } = saldos
  const { atualizar: atualizarEntradas } = entradas

  return (
    <Page aria-labelledby="entrada-titulo">
      <Trilha aria-label="Você está em"><Link to="/estoque">Estoque</Link> / Registrar entrada</Trilha>
      <h1 id="entrada-titulo">Registrar entrada de produtos</h1>
      <S.Layout>
        <S.Card aria-label="Nova entrada">
          {saldos.dados === null ? (
            saldos.carregando ? <S.Estado role="status">Carregando produtos…</S.Estado> : (
              <S.Estado>
                <ErrorText role="alert">{saldos.erro}</ErrorText>
                <Button type="button" onClick={atualizarSaldos}>Tentar novamente</Button>
              </S.Estado>
            )
          ) : saldos.dados.length === 0 ? (
            <S.Estado>
              <p>Nenhum produto cadastrado. Cadastre um produto antes de registrar uma entrada.</p>
              <ButtonLink to="/produtos">Cadastrar produto</ButtonLink>
            </S.Estado>
          ) : (
            <FormularioEntrada produtos={saldos.dados} aoRegistrar={() => { atualizarSaldos(); atualizarEntradas() }} />
          )}
        </S.Card>
        <UltimasEntradas consulta={entradas} />
      </S.Layout>
    </Page>
  )
}

function FormularioEntrada({ produtos, aoRegistrar }: { produtos: SaldoEstoque[]; aoRegistrar: () => void }) {
  const navigate = useNavigate()
  const inicial = useMemo<ValoresEntrada>(() => ({ produtoId: '', quantidade: '', data: hojeEmSaoPaulo() }), [])
  const form = useForm<ValoresEntrada>({ defaultValues: inicial, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, control, formState: { errors, isSubmitting } } = form
  const [produtoId, quantidade] = useWatch({ control, name: ['produtoId', 'quantidade'] })
  const selecionado = produtos.find((produto) => String(produto.id) === produtoId)
  const { erroGeral, limparErroGeral, aoEnviar } = useEnvioCadastro(form, {
    valoresIniciais: inicial,
    primeiroCampo: 'produtoId',
    enviar: (valores, signal) => registrarEntrada({ produtoId: Number(valores.produtoId), quantidade: Number(valores.quantidade), data: valores.data }, signal),
    interpretarErro: erroDeEntrada,
    mensagemSucesso: (entrada) => `Entrada registrada. Saldo de ${entrada.produto.nome}: ${unidades(entrada.saldoAtual)}.`,
    aoCadastrar: aoRegistrar,
  })

  return (
    <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
      {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
      <fieldset disabled={isSubmitting}>
        <Field>
          <label htmlFor="entrada-produto">Produto<Obrigatorio aria-hidden="true"> *</Obrigatorio></label>
          <select id="entrada-produto" aria-required="true" aria-invalid={Boolean(errors.produtoId)}
            aria-describedby={[selecionado && 'entrada-produto-saldo', errors.produtoId && 'entrada-produto-erro'].filter(Boolean).join(' ') || undefined}
            {...register('produtoId', { required: 'Selecione o produto.' })}>
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => <option key={produto.id} value={String(produto.id)}>{rotuloProduto(produto)}</option>)}
          </select>
          {selecionado && (
            <S.Ajuda id="entrada-produto-saldo">
              Saldo atual: {unidades(selecionado.saldo)} · mínimo: {unidades(selecionado.estoqueMinimo)}
            </S.Ajuda>
          )}
          {errors.produtoId && <ErrorText id="entrada-produto-erro" role="alert">{errors.produtoId.message}</ErrorText>}
        </Field>
        <S.Linha $colunas={2}>
          <Field>
            <label htmlFor="entrada-quantidade">Quantidade<Obrigatorio aria-hidden="true"> *</Obrigatorio></label>
            <input id="entrada-quantidade" inputMode="numeric" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.quantidade)} aria-describedby={errors.quantidade ? 'entrada-quantidade-erro' : undefined}
              {...register('quantidade', {
                setValueAs: (valor: string) => valor.trim(), required: 'Informe a quantidade.',
                pattern: { value: /^\d+$/, message: 'Use uma quantidade inteira.' },
                validate: (valor) => quantidadeValida(valor) || 'Informe uma quantidade maior que zero.',
              })} />
            {errors.quantidade && <ErrorText id="entrada-quantidade-erro" role="alert">{errors.quantidade.message}</ErrorText>}
          </Field>
          <Field>
            <label htmlFor="entrada-data">Data<Obrigatorio aria-hidden="true"> *</Obrigatorio></label>
            <input id="entrada-data" type="date" aria-required="true" aria-invalid={Boolean(errors.data)}
              aria-describedby={errors.data ? 'entrada-data-erro' : undefined}
              {...register('data', { required: 'Informe a data da entrada.' })} />
            {errors.data && <ErrorText id="entrada-data-erro" role="alert">{errors.data.message}</ErrorText>}
          </Field>
        </S.Linha>
        {selecionado && quantidadeValida(quantidade) && (
          <S.InfoSaldo aria-live="polite">
            Saldo após a entrada: <strong>{unidades(selecionado.saldo + Number(quantidade))}</strong>
          </S.InfoSaldo>
        )}
      </fieldset>
      <S.Botoes>
        <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando…' : 'Registrar entrada'}</PrimaryButton>
        <Button type="button" disabled={isSubmitting} onClick={() => navigate('/estoque')}>Cancelar</Button>
      </S.Botoes>
    </S.Form>
  )
}

interface ConsultaEntradas { dados: MovimentacaoEstoque[] | null; erro: string | null; carregando: boolean; atualizar: () => void }

function UltimasEntradas({ consulta }: { consulta: ConsultaEntradas }) {
  const { dados, erro, carregando, atualizar } = consulta
  return (
    <S.CardTabela aria-labelledby="ultimas-entradas-titulo" aria-busy={carregando}>
      <h2 id="ultimas-entradas-titulo">Últimas entradas</h2>
      {dados === null && carregando && <S.EstadoTabela role="status">Carregando…</S.EstadoTabela>}
      {erro && (
        <S.EstadoTabela>
          <ErrorText role="alert">{erro}</ErrorText>
          <Button type="button" onClick={atualizar} disabled={carregando}>Tentar novamente</Button>
        </S.EstadoTabela>
      )}
      {dados?.length === 0 && <S.EstadoTabela>Nenhuma entrada registrada ainda.</S.EstadoTabela>}
      {dados && dados.length > 0 && (
        <Table>
          <caption>Entradas mais recentes</caption>
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Produto</th>
              <th scope="col" data-alinhamento="direita">Quantidade</th>
              <th scope="col" data-alinhamento="direita">Usuário</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((entrada) => (
              <tr key={entrada.id}>
                <td data-label="Data" data-quebra="nunca">{formatarData(entrada.data)}</td>
                <td data-label="Produto">{entrada.produtoNome}</td>
                <td data-label="Quantidade" data-alinhamento="direita">+{entrada.quantidade.toLocaleString('pt-BR')}</td>
                <td data-label="Usuário" data-alinhamento="direita">{entrada.usuarioResponsavel}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </S.CardTabela>
  )
}
