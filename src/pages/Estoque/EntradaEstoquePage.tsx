import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ButtonLink, ErrorText, Eyebrow, Field, Page, PrimaryButton } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { listarProdutos } from '@/services/produtoService'
import { erroDeEntrada, registrarEntrada } from '@/services/estoqueService'
import type { EntradaEstoque } from '@/types/estoque'
import type { Produto } from '@/types/produto'
import { formatarData, formatarDataHora, hojeEmSaoPaulo } from '@/utils/pedido'
import * as S from './styles'

interface ValoresEntrada { produtoId: string; quantidade: string; data: string }

export function EntradaEstoquePage() {
  useEffect(() => { document.title = 'Entrada de estoque | SGLU' }, [])
  const consulta = useConsulta(listarProdutos, 'Não foi possível carregar os produtos.')
  const [ultimaEntrada, setUltimaEntrada] = useState<EntradaEstoque | null>(null)

  return (
    <Page aria-labelledby="entrada-titulo">
      <Eyebrow>Estoque</Eyebrow>
      <h1 id="entrada-titulo">Entrada de estoque</h1>
      <S.Layout>
        <S.Card aria-labelledby="nova-entrada-titulo">
          <h2 id="nova-entrada-titulo">Registrar entrada</h2>
          {consulta.dados === null ? (
            consulta.carregando ? <p role="status">Carregando produtos…</p> : (
              <><ErrorText role="alert">{consulta.erro}</ErrorText>
                <S.Actions><Button onClick={consulta.atualizar}>Tentar novamente</Button></S.Actions></>
            )
          ) : consulta.dados.length === 0 ? (
            <><p>Nenhum produto cadastrado. Cadastre um produto antes de registrar uma entrada.</p>
              <S.Actions><ButtonLink to="/produtos">Cadastrar produto</ButtonLink></S.Actions></>
          ) : <FormularioEntrada produtos={consulta.dados} aoRegistrar={setUltimaEntrada} />}
        </S.Card>
        <S.Card aria-labelledby="resumo-entrada-titulo" aria-live="polite">
          <h2 id="resumo-entrada-titulo">Última entrada registrada nesta tela</h2>
          {ultimaEntrada ? (
            <S.Dados>
              <div><dt>Produto</dt><dd>{ultimaEntrada.produto.nome} ({ultimaEntrada.produto.codigo})</dd></div>
              <div><dt>Quantidade recebida</dt><dd>{ultimaEntrada.quantidade.toLocaleString('pt-BR')} unidades</dd></div>
              <div><dt>Data da entrada</dt><dd>{formatarData(ultimaEntrada.data)}</dd></div>
              <div><dt>Saldo após esta entrada</dt><dd data-testid="saldo-apos-entrada">{ultimaEntrada.saldoAtual.toLocaleString('pt-BR')} unidades</dd></div>
              <div><dt>Registrada por</dt><dd>{ultimaEntrada.usuario.nome} · {formatarDataHora(ultimaEntrada.registradoEm)}</dd></div>
            </S.Dados>
          ) : <S.Ajuda>A confirmação aparecerá aqui após o registro. A entrada soma a quantidade ao saldo do produto.</S.Ajuda>}
        </S.Card>
      </S.Layout>
    </Page>
  )
}

function FormularioEntrada({ produtos, aoRegistrar }: { produtos: Produto[]; aoRegistrar: (entrada: EntradaEstoque) => void }) {
  const inicial = useMemo<ValoresEntrada>(() => ({ produtoId: '', quantidade: '', data: hojeEmSaoPaulo() }), [])
  const form = useForm<ValoresEntrada>({ defaultValues: inicial, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, formState: { errors, isSubmitting } } = form
  const { erroGeral, limparErroGeral, aoEnviar, cancelar } = useEnvioCadastro(form, {
    valoresIniciais: inicial,
    primeiroCampo: 'produtoId',
    enviar: (valores, signal) => registrarEntrada({ produtoId: Number(valores.produtoId), quantidade: Number(valores.quantidade), data: valores.data }, signal),
    interpretarErro: erroDeEntrada,
    mensagemSucesso: 'Entrada registrada. Saldo atualizado.',
    aoCadastrar: aoRegistrar,
  })

  return (
    <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
      {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
      <fieldset disabled={isSubmitting}>
        <Field>
          <label htmlFor="entrada-produto">Produto</label>
          <select id="entrada-produto" aria-required="true" aria-invalid={Boolean(errors.produtoId)}
            aria-describedby={errors.produtoId ? 'entrada-produto-erro' : undefined}
            {...register('produtoId', { required: 'Selecione o produto.' })}>
            <option value="">Selecione um produto</option>
            {produtos.map(produto => <option key={produto.id} value={String(produto.id)}>{produto.nome} ({produto.codigo})</option>)}
          </select>
          {errors.produtoId && <ErrorText id="entrada-produto-erro" role="alert">{errors.produtoId.message}</ErrorText>}
        </Field>
        <Field>
          <label htmlFor="entrada-quantidade">Quantidade</label>
          <input id="entrada-quantidade" inputMode="numeric" autoComplete="off" aria-required="true"
            aria-invalid={Boolean(errors.quantidade)} aria-describedby={errors.quantidade ? 'entrada-quantidade-erro' : undefined}
            {...register('quantidade', {
              setValueAs: (valor: string) => valor.trim(), required: 'Informe a quantidade.',
              pattern: { value: /^\d+$/, message: 'Use uma quantidade inteira.' },
              validate: valor => (Number(valor) > 0 && Number(valor) <= 2_147_483_647) || 'Informe entre 1 e 2.147.483.647 unidades.',
            })} />
          {errors.quantidade && <ErrorText id="entrada-quantidade-erro" role="alert">{errors.quantidade.message}</ErrorText>}
        </Field>
        <Field>
          <label htmlFor="entrada-data">Data da entrada</label>
          <input id="entrada-data" type="date" aria-required="true" aria-invalid={Boolean(errors.data)}
            aria-describedby={errors.data ? 'entrada-data-erro' : undefined}
            {...register('data', { required: 'Informe a data da entrada.' })} />
          {errors.data && <ErrorText id="entrada-data-erro" role="alert">{errors.data.message}</ErrorText>}
        </Field>
      </fieldset>
      <S.Ajuda>Todos os campos são obrigatórios. Informe a quantidade recebida em unidades inteiras.</S.Ajuda>
      <S.Actions>
        <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando…' : 'Registrar entrada'}</PrimaryButton>
        <Button type="button" disabled={isSubmitting} onClick={cancelar}>Limpar campos</Button>
      </S.Actions>
    </S.Form>
  )
}
