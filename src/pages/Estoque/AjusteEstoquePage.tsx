import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ButtonLink, ErrorText, Field, Obrigatorio, Page, PrimaryButton, Trilha } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { ajustarInventario, erroDeAjuste, listarSaldos } from '@/services/estoqueService'
import type { SaldoEstoque } from '@/types/estoque'
import { diferencaEmUnidades, rotuloProduto, unidades } from '@/utils/estoque'
import * as S from './styles'

interface ValoresAjuste { produtoId: string; quantidadeContada: string; justificativa: string }

const MAIOR_QUANTIDADE = 2_147_483_647
const contagemValida = (valor: string) => /^\d+$/.test(valor.trim()) && Number(valor) <= MAIOR_QUANTIDADE

/** Tela 9: ajuste do saldo após inventário, exclusivo do Administrador (RF11). */
export function AjusteEstoquePage() {
  useEffect(() => { document.title = 'Ajuste de inventário | SGLU' }, [])
  const consulta = useConsulta(listarSaldos, 'Não foi possível carregar os produtos e saldos.')
  const { atualizar } = consulta
  return (
    <Page aria-labelledby="ajuste-titulo">
      <S.Cabecalho>
        <div>
          <Trilha aria-label="Você está em"><Link to="/estoque">Estoque</Link> / Ajustar inventário</Trilha>
          <h1 id="ajuste-titulo">Ajuste de inventário</h1>
        </div>
        <S.Exclusivo>Acesso exclusivo do Administrador</S.Exclusivo>
      </S.Cabecalho>
      <S.CardFormulario aria-label="Registrar contagem">
        {consulta.dados === null ? (
          consulta.carregando ? <S.Estado role="status">Carregando produtos…</S.Estado> : (
            <S.Estado>
              <ErrorText role="alert">{consulta.erro}</ErrorText>
              <Button type="button" onClick={atualizar}>Tentar novamente</Button>
            </S.Estado>
          )
        ) : consulta.dados.length === 0 ? (
          <S.Estado>
            <p>Nenhum produto cadastrado.</p>
            <ButtonLink to="/produtos">Cadastrar produto</ButtonLink>
          </S.Estado>
        ) : (
          <>
            {consulta.erro && <ErrorText role="alert">Saldos desatualizados: {consulta.erro}</ErrorText>}
            <FormularioAjuste produtos={consulta.dados} aoRegistrar={atualizar} />
          </>
        )}
      </S.CardFormulario>
    </Page>
  )
}

function FormularioAjuste({ produtos, aoRegistrar }: { produtos: SaldoEstoque[]; aoRegistrar: () => void }) {
  const navigate = useNavigate()
  const inicial = useMemo<ValoresAjuste>(() => ({ produtoId: '', quantidadeContada: '', justificativa: '' }), [])
  const form = useForm<ValoresAjuste>({ defaultValues: inicial, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, control, formState: { errors, isSubmitting } } = form
  const [produtoId, contada] = useWatch({ control, name: ['produtoId', 'quantidadeContada'] })
  const selecionado = produtos.find((produto) => String(produto.id) === produtoId)
  const diferenca = selecionado && contagemValida(contada) ? Number(contada) - selecionado.saldo : null

  const { erroGeral, limparErroGeral, aoEnviar } = useEnvioCadastro(form, {
    valoresIniciais: inicial,
    primeiroCampo: 'produtoId',
    enviar: (valores, signal) => ajustarInventario({
      produtoId: Number(valores.produtoId), quantidadeContada: Number(valores.quantidadeContada), justificativa: valores.justificativa.trim(),
    }, signal),
    interpretarErro: erroDeAjuste,
    mensagemSucesso: (ajuste) => `Inventário ajustado: ${ajuste.produtoNome} passou de ${unidades(ajuste.saldoAnterior)} para ${unidades(ajuste.saldoAtual)}.`,
    aoCadastrar: aoRegistrar,
  })

  return (
    <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
      {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
      <fieldset disabled={isSubmitting}>
        <Field>
          <label htmlFor="ajuste-produto">Produto<Obrigatorio aria-hidden="true"> *</Obrigatorio></label>
          <select id="ajuste-produto" aria-required="true" aria-invalid={Boolean(errors.produtoId)}
            aria-describedby={errors.produtoId ? 'ajuste-produto-erro' : undefined}
            {...register('produtoId', { required: 'Selecione o produto.' })}>
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => <option key={produto.id} value={String(produto.id)}>{rotuloProduto(produto)}</option>)}
          </select>
          {errors.produtoId && <ErrorText id="ajuste-produto-erro" role="alert">{errors.produtoId.message}</ErrorText>}
        </Field>
        <S.Linha $colunas={3}>
          <Field>
            <label htmlFor="ajuste-saldo-sistema">Saldo no sistema</label>
            <input id="ajuste-saldo-sistema" readOnly tabIndex={-1} value={selecionado ? unidades(selecionado.saldo) : '—'} />
          </Field>
          <Field>
            <label htmlFor="ajuste-quantidade">Saldo contado<Obrigatorio aria-hidden="true"> *</Obrigatorio></label>
            <input id="ajuste-quantidade" inputMode="numeric" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.quantidadeContada)}
              aria-describedby={[diferenca !== null && 'ajuste-diferenca', errors.quantidadeContada && 'ajuste-quantidade-erro'].filter(Boolean).join(' ') || undefined}
              {...register('quantidadeContada', {
                setValueAs: (valor: string) => valor.trim(), required: 'Informe o saldo contado.',
                pattern: { value: /^\d+$/, message: 'Use uma quantidade inteira, igual ou maior que zero.' },
                validate: (valor, valores) => {
                  if (!contagemValida(valor)) return 'Informe uma quantidade de até 2.147.483.647 unidades.'
                  const produto = produtos.find((item) => String(item.id) === valores.produtoId)
                  return !produto || Number(valor) !== produto.saldo || 'A contagem é igual ao saldo no sistema; não há ajuste a registrar.'
                },
              })} />
          </Field>
          <Field>
            <label htmlFor="ajuste-diferenca">Diferença</label>
            <input id="ajuste-diferenca" readOnly tabIndex={-1} value={diferenca === null ? '—' : diferencaEmUnidades(diferenca)} />
          </Field>
        </S.Linha>
        {errors.quantidadeContada && <ErrorText id="ajuste-quantidade-erro" role="alert">{errors.quantidadeContada.message}</ErrorText>}
        <Field>
          <label htmlFor="ajuste-justificativa">Justificativa<Obrigatorio aria-hidden="true"> *</Obrigatorio></label>
          <input id="ajuste-justificativa" maxLength={500} autoComplete="off" aria-required="true"
            aria-invalid={Boolean(errors.justificativa)}
            aria-describedby={errors.justificativa ? 'ajuste-justificativa-ajuda ajuste-justificativa-erro' : 'ajuste-justificativa-ajuda'}
            {...register('justificativa', {
              setValueAs: (valor: string) => valor.trim(), required: 'Informe a justificativa.',
              maxLength: { value: 500, message: 'Use até 500 caracteres.' },
            })} />
          <S.Ajuda id="ajuste-justificativa-ajuda">Obrigatória. Fica registrada no histórico de movimentações do produto.</S.Ajuda>
          {errors.justificativa && <ErrorText id="ajuste-justificativa-erro" role="alert">{errors.justificativa.message}</ErrorText>}
        </Field>
      </fieldset>
      <S.Botoes>
        <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando…' : 'Salvar ajuste'}</PrimaryButton>
        <Button type="button" disabled={isSubmitting} onClick={() => navigate('/estoque')}>Cancelar</Button>
      </S.Botoes>
    </S.Form>
  )
}
