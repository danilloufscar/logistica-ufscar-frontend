import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, ButtonLink, ErrorText, Eyebrow, Field, Page, PrimaryButton } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { ajustarInventario, erroDeAjuste, listarSaldos } from '@/services/estoqueService'
import type { AjusteEstoque, SaldoEstoque } from '@/types/estoque'
import { formatarDataHora } from '@/utils/pedido'
import * as S from './styles'

interface ValoresAjuste { produtoId: string; quantidadeContada: string; justificativa: string }

export function AjusteEstoquePage() {
  useEffect(() => { document.title = 'Ajuste de inventário | SGLU' }, [])
  const consulta = useConsulta(listarSaldos, 'Não foi possível carregar os produtos e saldos.')
  const [ultimoAjuste, setUltimoAjuste] = useState<AjusteEstoque | null>(null)
  return (
    <Page aria-labelledby="ajuste-titulo">
      <Eyebrow>Estoque · Administração</Eyebrow>
      <h1 id="ajuste-titulo">Ajuste de inventário</h1>
      <S.Actions><ButtonLink to="/estoque">Consultar saldos</ButtonLink></S.Actions>
      <S.Layout>
        <S.Card>
          <h2>Registrar contagem</h2>
          {consulta.erro && <><ErrorText role="alert">{consulta.erro}</ErrorText><Button onClick={consulta.atualizar}>Tentar novamente</Button></>}
          {consulta.dados === null ? (consulta.carregando && <p role="status">Carregando produtos…</p>)
            : consulta.dados.length === 0 ? <><p>Nenhum produto cadastrado.</p><ButtonLink to="/produtos">Cadastrar produto</ButtonLink></>
              : <FormularioAjuste produtos={consulta.dados} aoRegistrar={ajuste => {
                setUltimoAjuste(ajuste)
                consulta.atualizar()
              }} />}
        </S.Card>
        <S.Card aria-live="polite">
          <h2>Último ajuste registrado nesta tela</h2>
          {ultimoAjuste ? <>
            <S.Dados>
              <div><dt>Produto</dt><dd>{ultimoAjuste.produtoNome}</dd></div>
              <div><dt>Saldo anterior</dt><dd>{ultimoAjuste.saldoAnterior.toLocaleString('pt-BR')}</dd></div>
              <div><dt>Saldo após o ajuste</dt><dd>{ultimoAjuste.saldoAtual.toLocaleString('pt-BR')}</dd></div>
              <div><dt>Ajuste</dt><dd>{ultimoAjuste.tipo === 'AJUSTE_ENTRADA' ? '+' : '−'}{ultimoAjuste.quantidadeAjustada.toLocaleString('pt-BR')} unidades</dd></div>
              <div><dt>Justificativa</dt><dd>{ultimoAjuste.justificativa}</dd></div>
              <div><dt>Responsável</dt><dd>{ultimoAjuste.usuarioResponsavel} · {formatarDataHora(ultimoAjuste.registradoEm)}</dd></div>
            </S.Dados>
            <S.Actions><ButtonLink to={`/estoque/produtos/${ultimoAjuste.produtoId}/movimentacoes`}>Ver movimentações</ButtonLink></S.Actions>
          </> : <S.Ajuda>A contagem substitui o saldo atual. A diferença será registrada no histórico, com sua identificação e justificativa.</S.Ajuda>}
        </S.Card>
      </S.Layout>
    </Page>
  )
}

function FormularioAjuste({ produtos, aoRegistrar }: { produtos: SaldoEstoque[]; aoRegistrar: (ajuste: AjusteEstoque) => void }) {
  const inicial = useMemo<ValoresAjuste>(() => ({ produtoId: '', quantidadeContada: '', justificativa: '' }), [])
  const form = useForm<ValoresAjuste>({ defaultValues: inicial, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, formState: { errors, isSubmitting } } = form
  const produtoId = useWatch({ control: form.control, name: 'produtoId' })
  const selecionado = produtos.find(produto => String(produto.id) === produtoId)
  const { erroGeral, limparErroGeral, aoEnviar, cancelar } = useEnvioCadastro(form, {
    valoresIniciais: inicial, primeiroCampo: 'produtoId',
    enviar: (valores, signal) => ajustarInventario({ produtoId: Number(valores.produtoId), quantidadeContada: Number(valores.quantidadeContada), justificativa: valores.justificativa.trim() }, signal),
    interpretarErro: erroDeAjuste, mensagemSucesso: 'Inventário ajustado. Saldo e histórico atualizados.', aoCadastrar: aoRegistrar,
  })
  return (
    <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
      {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
      <fieldset disabled={isSubmitting}>
        <Field>
          <label htmlFor="ajuste-produto">Produto</label>
          <select id="ajuste-produto" aria-required="true" aria-invalid={Boolean(errors.produtoId)} aria-describedby={errors.produtoId ? 'ajuste-produto-erro' : undefined} {...register('produtoId', { required: 'Selecione o produto.' })}>
            <option value="">Selecione um produto</option>
            {produtos.map(produto => <option key={produto.id} value={String(produto.id)}>{produto.nome} ({produto.codigo})</option>)}
          </select>
          {errors.produtoId && <ErrorText id="ajuste-produto-erro" role="alert">{errors.produtoId.message}</ErrorText>}
        </Field>
        {selecionado && <S.Ajuda>Saldo na última consulta: {selecionado.saldo.toLocaleString('pt-BR')} unidades. O ajuste considera o saldo no momento da gravação.</S.Ajuda>}
        <Field>
          <label htmlFor="ajuste-quantidade">Quantidade contada</label>
          <input id="ajuste-quantidade" inputMode="numeric" autoComplete="off" aria-required="true" aria-invalid={Boolean(errors.quantidadeContada)} aria-describedby={errors.quantidadeContada ? 'ajuste-quantidade-erro' : undefined} {...register('quantidadeContada', {
            setValueAs: (valor: string) => valor.trim(), required: 'Informe a quantidade contada.',
            pattern: { value: /^\d+$/, message: 'Use uma quantidade inteira, igual ou maior que zero.' },
            validate: valor => (Number(valor) >= 0 && Number(valor) <= 2_147_483_647) || 'Informe entre 0 e 2.147.483.647 unidades.',
          })} />
          {errors.quantidadeContada && <ErrorText id="ajuste-quantidade-erro" role="alert">{errors.quantidadeContada.message}</ErrorText>}
        </Field>
        <Field>
          <label htmlFor="ajuste-justificativa">Justificativa</label>
          <textarea id="ajuste-justificativa" rows={4} maxLength={500} aria-required="true" aria-invalid={Boolean(errors.justificativa)} aria-describedby={errors.justificativa ? 'ajuste-justificativa-erro' : undefined} {...register('justificativa', {
            setValueAs: (valor: string) => valor.trim(), required: 'Informe a justificativa.', maxLength: { value: 500, message: 'Use até 500 caracteres.' },
          })} />
          {errors.justificativa && <ErrorText id="ajuste-justificativa-erro" role="alert">{errors.justificativa.message}</ErrorText>}
        </Field>
      </fieldset>
      <S.Ajuda>Todos os campos são obrigatórios. Informe a quantidade total contada, e não a diferença. Uma contagem igual ao saldo não gera ajuste.</S.Ajuda>
      <S.Actions>
        <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando…' : 'Registrar ajuste'}</PrimaryButton>
        <Button type="button" disabled={isSubmitting} onClick={cancelar}>Limpar campos</Button>
      </S.Actions>
    </S.Form>
  )
}
