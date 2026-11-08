import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PageContent } from '@/components/PageContent'
import { cadastrarUsuario, erroDeCadastro } from '@/services/usuarioService'
import type { CadastroUsuario, CampoCadastroUsuario } from '@/types/usuario'
import * as S from './styles'

type FormularioUsuario = Omit<CadastroUsuario, 'perfil'> & { perfil: CadastroUsuario['perfil'] | '' }

export function NovoUsuarioPage() {
  const navigate = useNavigate()
  const requisicao = useRef<AbortController | null>(null)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormularioUsuario>({
    defaultValues: { nome: '', email: '', senha: '', perfil: '' },
    mode: 'onSubmit', reValidateMode: 'onChange',
  })

  useEffect(() => {
    document.title = 'Novo usuário | SGLU'
    return () => requisicao.current?.abort()
  }, [])

  async function onSubmit(dados: FormularioUsuario) {
    if (requisicao.current) return
    if (dados.perfil !== 'ADMINISTRADOR' && dados.perfil !== 'OPERADOR') {
      setError('perfil', { message: 'Selecione um perfil válido.' }, { shouldFocus: true })
      return
    }
    const controller = new AbortController()
    requisicao.current = controller
    setErroGeral(null)
    try {
      await cadastrarUsuario({ ...dados, perfil: dados.perfil }, controller.signal)
      if (controller.signal.aborted) return
      toast.success('Usuário cadastrado com sucesso.')
      navigate('/usuarios', { replace: true })
    } catch (erro) {
      if (controller.signal.aborted) return
      const resultado = erroDeCadastro(erro)
      setErroGeral(resultado.mensagem)
      let primeiroCampo = true
      for (const campo of Object.keys(resultado.campos) as CampoCadastroUsuario[]) {
        setError(campo, { type: 'server', message: resultado.campos[campo] }, { shouldFocus: primeiroCampo })
        primeiroCampo = false
      }
    } finally {
      if (requisicao.current === controller) requisicao.current = null
    }
  }

  return (
    <PageContent>
      <h1>Novo usuário</h1>
      <p>Informe os dados e o perfil de acesso. Todos os campos são obrigatórios.</p>
      <S.FormPanel>
        <S.Form noValidate onSubmit={(event) => { void handleSubmit(onSubmit)(event) }} aria-busy={isSubmitting} onChange={() => setErroGeral(null)}>
          {erroGeral && <S.ErrorText role="alert">{erroGeral}</S.ErrorText>}
          <fieldset disabled={isSubmitting}>
            <S.Field>
              <label htmlFor="nome">Nome</label>
              <input id="nome" autoComplete="name" aria-invalid={Boolean(errors.nome)} aria-describedby={errors.nome ? 'nome-error' : undefined}
                {...register('nome', { setValueAs: (value: string) => value.trim(), required: 'Informe o nome.', maxLength: { value: 120, message: 'O nome deve ter até 120 caracteres.' } })} />
              {errors.nome && <S.ErrorText id="nome-error" role="alert">{errors.nome.message}</S.ErrorText>}
            </S.Field>
            <S.Field>
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" autoComplete="off" autoCapitalize="none" spellCheck={false} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', { setValueAs: (value: string) => value.trim().toLowerCase(), required: 'Informe o e-mail.', maxLength: { value: 254, message: 'O e-mail deve ter até 254 caracteres.' }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Informe um e-mail válido.' } })} />
              {errors.email && <S.ErrorText id="email-error" role="alert">{errors.email.message}</S.ErrorText>}
            </S.Field>
            <S.Field>
              <label htmlFor="senha">Senha inicial</label>
              <input id="senha" type={mostrarSenha ? 'text' : 'password'} autoComplete="new-password" aria-invalid={Boolean(errors.senha)} aria-describedby={errors.senha ? 'senha-help senha-error' : 'senha-help'}
                {...register('senha', {
                  required: 'Informe a senha inicial.',
                  validate: {
                    preenchida: (value) => value.trim().length > 0 || 'Informe a senha inicial.',
                    tamanho: (value) => new TextEncoder().encode(value).length <= 72 || 'A senha ultrapassa o tamanho permitido. Use uma senha mais curta.',
                  },
                })} />
              <p id="senha-help">Até 72 caracteres simples. Acentos e outros símbolos podem reduzir esse limite.</p>
              {errors.senha && <S.ErrorText id="senha-error" role="alert">{errors.senha.message}</S.ErrorText>}
              <S.Toggle><input type="checkbox" checked={mostrarSenha} onChange={(event) => setMostrarSenha(event.target.checked)} />Mostrar senha</S.Toggle>
            </S.Field>
            <S.Field>
              <label htmlFor="perfil">Perfil</label>
              <select id="perfil" aria-invalid={Boolean(errors.perfil)} aria-describedby={errors.perfil ? 'perfil-help perfil-error' : 'perfil-help'}
                {...register('perfil', { required: 'Selecione o perfil.' })}>
                <option value="">Selecione um perfil</option>
                <option value="OPERADOR">Operador</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
              <p id="perfil-help">O Administrador também pode cadastrar usuários. O Operador acessa as atividades operacionais.</p>
              {errors.perfil && <S.ErrorText id="perfil-error" role="alert">{errors.perfil.message}</S.ErrorText>}
            </S.Field>
          </fieldset>
          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Cadastrando…' : 'Cadastrar usuário'}</S.PrimaryButton>
            <S.Button type="button" disabled={isSubmitting} onClick={() => navigate('/usuarios')}>Voltar à lista</S.Button>
          </S.Actions>
        </S.Form>
      </S.FormPanel>
    </PageContent>
  )
}
