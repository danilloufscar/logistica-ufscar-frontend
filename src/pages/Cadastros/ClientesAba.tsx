import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { useConsulta } from '@/hooks/useConsulta'
import { cadastrarCliente, erroDeCadastroCliente, listarClientes } from '@/services/clienteService'
import type { CadastroCliente, Cliente } from '@/types/cliente'
import { TabelaDados, type Coluna } from '@/components/TabelaDados'
import * as S from './styles'

const COLUNAS: readonly Coluna<Cliente>[] = [
  { titulo: 'Nome', valor: (cliente) => cliente.nome },
  { titulo: 'Telefone', valor: (cliente) => cliente.telefone, semQuebra: true },
  { titulo: 'Endereço', valor: (cliente) => cliente.endereco },
]

const TEXTOS = {
  carregando: 'Carregando clientes…',
  vazio: 'Nenhum cliente cadastrado',
  dicaVazio: 'Preencha o formulário “Novo cliente” para cadastrar o primeiro.',
  legenda: (total: number) => `${total} ${total === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}`,
}

const VAZIO: CadastroCliente = { nome: '', telefone: '', endereco: '' }

export function ClientesAba() {
  const consulta = useConsulta(listarClientes, 'Não foi possível carregar os clientes.')
  useEffect(() => { document.title = 'Clientes | SGLU' }, [])

  return (
    <S.Layout>
      <TabelaDados consulta={consulta} colunas={COLUNAS} textos={TEXTOS} />
      <FormularioCliente aoCadastrar={consulta.atualizar} />
    </S.Layout>
  )
}

function FormularioCliente({ aoCadastrar }: { aoCadastrar: () => void }) {
  const form = useForm<CadastroCliente>({ defaultValues: VAZIO, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, formState: { errors, isSubmitting } } = form
  const { erroGeral, limparErroGeral, aoEnviar, cancelar } = useEnvioCadastro(form, {
    valoresIniciais: VAZIO,
    primeiroCampo: 'nome',
    enviar: cadastrarCliente,
    interpretarErro: erroDeCadastroCliente,
    mensagemSucesso: 'Cliente cadastrado com sucesso.',
    aoCadastrar,
  })

  return (
    <S.FormCard aria-labelledby="novo-cliente-titulo">
      <h2 id="novo-cliente-titulo">Novo cliente</h2>
      <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
        {erroGeral && <S.ErrorText role="alert">{erroGeral}</S.ErrorText>}
        <fieldset disabled={isSubmitting}>
          <S.Field>
            <label htmlFor="cliente-nome">Nome<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="cliente-nome" placeholder="Razão social ou nome" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.nome)} aria-describedby={errors.nome ? 'cliente-nome-erro' : undefined}
              {...register('nome', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Informe o nome.',
                maxLength: { value: 120, message: 'O nome deve ter até 120 caracteres.' },
              })} />
            {errors.nome && <S.ErrorText id="cliente-nome-erro" role="alert">{errors.nome.message}</S.ErrorText>}
          </S.Field>
          <S.Field>
            <label htmlFor="cliente-telefone">Telefone<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="cliente-telefone" type="tel" placeholder="(15) 0000-0000" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.telefone)} aria-describedby={errors.telefone ? 'cliente-telefone-erro' : undefined}
              {...register('telefone', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Informe o telefone.',
                maxLength: { value: 30, message: 'O telefone deve ter até 30 caracteres.' },
              })} />
            {errors.telefone && <S.ErrorText id="cliente-telefone-erro" role="alert">{errors.telefone.message}</S.ErrorText>}
          </S.Field>
          <S.Field>
            <label htmlFor="cliente-endereco">Endereço<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="cliente-endereco" placeholder="Rua, número – Cidade/UF" autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.endereco)} aria-describedby={errors.endereco ? 'cliente-endereco-erro' : undefined}
              {...register('endereco', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Informe o endereço.',
                maxLength: { value: 500, message: 'O endereço deve ter até 500 caracteres.' },
              })} />
            {errors.endereco && <S.ErrorText id="cliente-endereco-erro" role="alert">{errors.endereco.message}</S.ErrorText>}
          </S.Field>
        </fieldset>
        <S.Actions>
          <S.PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando…' : 'Salvar cliente'}</S.PrimaryButton>
          <S.Button type="button" disabled={isSubmitting} onClick={cancelar}>Cancelar</S.Button>
        </S.Actions>
      </S.Form>
    </S.FormCard>
  )
}
