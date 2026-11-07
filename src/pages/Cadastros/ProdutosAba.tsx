import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { useConsulta } from '@/hooks/useConsulta'
import { cadastrarProduto, erroDeCadastroProduto, listarProdutos } from '@/services/produtoService'
import type { CadastroProduto, Produto } from '@/types/produto'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import * as S from './styles'

const COLUNAS: readonly Coluna<Produto>[] = [
  { titulo: 'Código', valor: (produto) => produto.codigo },
  { titulo: 'Nome', valor: (produto) => produto.nome },
  { titulo: 'Estoque mínimo', valor: (produto) => produto.estoqueMinimo.toLocaleString('pt-BR'), alinhamento: 'direita' },
]

const TEXTOS = {
  carregando: 'Carregando produtos…',
  vazio: 'Nenhum produto cadastrado',
  dicaVazio: 'Preencha o formulário “Novo produto” para cadastrar o primeiro.',
  legenda: (total: number) => `${total} ${total === 1 ? 'produto cadastrado' : 'produtos cadastrados'}`,
}

// O estoque é digitado como texto para aceitar só inteiros, sem as conversões do campo numérico.
type FormularioProduto = Omit<CadastroProduto, 'estoqueMinimo'> & { estoqueMinimo: string }

const VAZIO: FormularioProduto = { codigo: '', nome: '', estoqueMinimo: '' }
const MAIOR_ESTOQUE = 2_147_483_647

function enviarProduto(dados: FormularioProduto, signal: AbortSignal) {
  return cadastrarProduto({ ...dados, estoqueMinimo: Number(dados.estoqueMinimo) }, signal)
}

export function ProdutosAba() {
  const consulta = useConsulta(listarProdutos, 'Não foi possível carregar os produtos.')
  useEffect(() => { document.title = 'Produtos | SGLU' }, [])

  return (
    <S.Layout>
      <TabelaDados consulta={consulta} colunas={COLUNAS} textos={TEXTOS} />
      <FormularioProduto aoCadastrar={consulta.atualizar} />
    </S.Layout>
  )
}

function FormularioProduto({ aoCadastrar }: { aoCadastrar: () => void }) {
  const form = useForm<FormularioProduto>({ defaultValues: VAZIO, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, formState: { errors, isSubmitting } } = form
  const { erroGeral, limparErroGeral, aoEnviar, cancelar } = useEnvioCadastro(form, {
    valoresIniciais: VAZIO,
    primeiroCampo: 'codigo',
    enviar: enviarProduto,
    interpretarErro: erroDeCadastroProduto,
    mensagemSucesso: 'Produto cadastrado com sucesso.',
    aoCadastrar,
  })

  return (
    <S.FormCard aria-labelledby="novo-produto-titulo">
      <h2 id="novo-produto-titulo">Novo produto</h2>
      <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
        {erroGeral && <S.ErrorText role="alert">{erroGeral}</S.ErrorText>}
        <fieldset disabled={isSubmitting}>
          <S.Field>
            <label htmlFor="produto-codigo">Código<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="produto-codigo" placeholder="Ex.: CX-G" autoComplete="off" autoCapitalize="characters" spellCheck={false}
              aria-required="true" aria-invalid={Boolean(errors.codigo)}
              aria-describedby={errors.codigo ? 'produto-ajuda produto-codigo-erro' : 'produto-ajuda'}
              {...register('codigo', {
                setValueAs: (valor: string) => valor.trim().toUpperCase(),
                required: 'Informe o código.',
                maxLength: { value: 64, message: 'O código deve ter até 64 caracteres.' },
              })} />
            {errors.codigo && <S.ErrorText id="produto-codigo-erro" role="alert">{errors.codigo.message}</S.ErrorText>}
          </S.Field>
          <S.Field>
            <label htmlFor="produto-nome">Nome<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="produto-nome" placeholder="Descrição do produto" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.nome)} aria-describedby={errors.nome ? 'produto-nome-erro' : undefined}
              {...register('nome', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Informe o nome.',
                maxLength: { value: 120, message: 'O nome deve ter até 120 caracteres.' },
              })} />
            {errors.nome && <S.ErrorText id="produto-nome-erro" role="alert">{errors.nome.message}</S.ErrorText>}
          </S.Field>
          <S.Field>
            <label htmlFor="produto-estoque">Estoque mínimo<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="produto-estoque" inputMode="numeric" placeholder="Quantidade em unidades" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.estoqueMinimo)} aria-describedby={errors.estoqueMinimo ? 'produto-estoque-erro' : undefined}
              {...register('estoqueMinimo', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Informe o estoque mínimo.',
                pattern: { value: /^\d+$/, message: 'Use um número inteiro igual ou maior que zero.' },
                validate: (valor) => Number(valor) <= MAIOR_ESTOQUE || 'Use um valor de até 2.147.483.647.',
              })} />
            {errors.estoqueMinimo && <S.ErrorText id="produto-estoque-erro" role="alert">{errors.estoqueMinimo.message}</S.ErrorText>}
          </S.Field>
        </fieldset>
        <S.Ajuda id="produto-ajuda">O código deve ser único. O saldo começa em zero e muda pelas entradas.</S.Ajuda>
        <S.Actions>
          <S.PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando…' : 'Salvar produto'}</S.PrimaryButton>
          <S.Button type="button" disabled={isSubmitting} onClick={cancelar}>Cancelar</S.Button>
        </S.Actions>
      </S.Form>
    </S.FormCard>
  )
}
