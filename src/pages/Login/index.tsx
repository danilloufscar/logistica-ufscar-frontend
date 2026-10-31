import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { entrar, limparErro } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import * as S from './styles'

interface LoginFields {
  email: string
  senha: string
}

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { usuario, carregando, erro, sessaoExpirada } = useAppSelector((state) => state.auth)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFields>({
    defaultValues: { email: '', senha: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const aguardando = carregando || isSubmitting

  useEffect(() => {
    document.title = 'Entrar | SGLU'
    dispatch(limparErro())
  }, [dispatch])

  if (usuario) return <Navigate to="/" replace />

  async function onSubmit(values: LoginFields) {
    const result = await dispatch(entrar(values))
    if (entrar.fulfilled.match(result)) navigate('/', { replace: true })
  }

  return (
    <S.Screen>
      <S.Content>
        <S.Brand>
          <S.BrandIcon aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
              <path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" />
              <path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5V14" />
            </svg>
          </S.BrandIcon>
          <strong>SGLU</strong>
          <p>Sistema de Gestão Logística UFSCar</p>
        </S.Brand>

        <S.Card aria-labelledby="login-title">
          <S.Title id="login-title">Entre na sua conta</S.Title>
          <S.Description>Use seu e-mail e senha para acessar o sistema.</S.Description>
          {sessaoExpirada && <S.SessionNotice role="status">Sua sessão expirou ou não é mais válida. Entre novamente.</S.SessionNotice>}
          <S.Form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={aguardando}
            onChange={() => { if (erro) dispatch(limparErro()) }}>
            <S.Field>
              <label htmlFor="email">E-mail</label>
              <S.Input id="email" type="email" autoComplete="username" autoCapitalize="none"
                spellCheck={false} placeholder="seu.email@exemplo.com" disabled={aguardando}
                aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', {
                  setValueAs: (value: string) => value.trim(),
                  required: 'Informe seu e-mail.',
                  maxLength: { value: 254, message: 'O e-mail deve ter até 254 caracteres.' },
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Informe um e-mail válido.' },
                })} />
              {errors.email && <S.ErrorText id="email-error" role="alert">{errors.email.message}</S.ErrorText>}
            </S.Field>

            <S.Field>
              <label htmlFor="senha">Senha</label>
              <S.PasswordControl>
                <S.Input id="senha" type={mostrarSenha ? 'text' : 'password'} autoComplete="current-password"
                  placeholder="Digite sua senha" disabled={aguardando}
                  aria-invalid={Boolean(errors.senha)} aria-describedby={errors.senha ? 'senha-error' : undefined}
                  {...register('senha', {
                    required: 'Informe sua senha.',
                    validate: (value) => value.trim().length > 0 || 'Informe sua senha.',
                  })} />
                <S.PasswordToggle type="button" aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-controls="senha" aria-pressed={mostrarSenha} disabled={aguardando}
                  onClick={() => setMostrarSenha((current) => !current)}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {mostrarSenha && <path d="m3 3 18 18" />}
                  </svg>
                </S.PasswordToggle>
              </S.PasswordControl>
              {errors.senha && <S.ErrorText id="senha-error" role="alert">{errors.senha.message}</S.ErrorText>}
            </S.Field>

            {erro && <S.ErrorText role="alert">{erro}</S.ErrorText>}
            <S.SubmitButton type="submit" disabled={aguardando}>
              {aguardando ? 'Entrando…' : 'Entrar'}
            </S.SubmitButton>
          </S.Form>
        </S.Card>
        <S.Footer>Precisa de acesso? Entre em contato com o administrador.</S.Footer>
      </S.Content>
    </S.Screen>
  )
}
