import { createAsyncThunk, createSlice, type PayloadAction, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit'
import { mensagemDeErro, tokenStorage } from '@/services/api'
import * as authService from '@/services/authService'
import type { Usuario } from '@/types/auth'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  expiraEm: number | null
  carregando: boolean
  erro: string | null
  sessaoExpirada: boolean
  requisicaoId: string | null
}

type AuthThunk = ThunkAction<void, { auth: AuthState }, unknown, UnknownAction>
type SessaoAutenticada = authService.Sessao & { token: string }

function estadoInicial(): AuthState {
  const token = tokenStorage.get()
  const sessao = token ? authService.sessaoDoToken(token) : null
  if (token && !sessao) tokenStorage.clear()
  return {
    token: sessao ? token : null,
    usuario: sessao?.usuario ?? null,
    expiraEm: sessao?.expiraEm ?? null,
    carregando: false, erro: null, requisicaoId: null,
    sessaoExpirada: Boolean(token && !sessao),
  }
}

export const entrar = createAsyncThunk<
  SessaoAutenticada,
  { email: string; senha: string },
  { rejectValue: string; state: { auth: AuthState } }
>('auth/entrar', async ({ email, senha }, { rejectWithValue, getState, requestId }) => {
  try {
    const token = await authService.login(email, senha)
    const sessao = authService.sessaoDoToken(token)
    if (!sessao) return rejectWithValue('Sessão inválida. Tente entrar de novo.')
    // Uma resposta antiga não pode restaurar a sessão após logout ou troca de usuário.
    if (getState().auth.requisicaoId !== requestId) return rejectWithValue('Solicitação cancelada.')
    tokenStorage.set(token)
    return { token, ...sessao }
  } catch (erro) {
    return rejectWithValue(mensagemDeErro(erro, 'E-mail ou senha incorretos'))
  }
}, { condition: (_, { getState }) => !getState().auth.carregando })

const authSlice = createSlice({
  name: 'auth',
  initialState: estadoInicial(),
  reducers: {
    limparErro: (state) => { state.erro = null },
    sessaoEncerrada: (state, action: PayloadAction<boolean>) => {
      state.token = null
      state.usuario = null
      state.expiraEm = null
      state.erro = null
      state.carregando = false
      state.requisicaoId = null
      state.sessaoExpirada = action.payload
    },
    sessaoSincronizada: (state, action: PayloadAction<SessaoAutenticada>) => {
      Object.assign(state, action.payload)
      state.erro = null
      state.carregando = false
      state.requisicaoId = null
      state.sessaoExpirada = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(entrar.pending, (state, action) => {
        state.carregando = true
        state.erro = null
        state.requisicaoId = action.meta.requestId
      })
      .addCase(entrar.fulfilled, (state, action) => {
        if (state.requisicaoId !== action.meta.requestId) return
        Object.assign(state, action.payload)
        state.carregando = false
        state.requisicaoId = null
        state.sessaoExpirada = false
      })
      .addCase(entrar.rejected, (state, action) => {
        if (state.requisicaoId !== action.meta.requestId) return
        state.carregando = false
        state.requisicaoId = null
        state.erro = action.payload ?? 'Não foi possível entrar.'
      })
  },
})

const { sessaoEncerrada, sessaoSincronizada } = authSlice.actions
export const { limparErro } = authSlice.actions

export const sair = (): AuthThunk => (dispatch) => {
  tokenStorage.clear()
  dispatch(sessaoEncerrada(false))
}

export const expirarSessao = (token: string): AuthThunk => (dispatch, getState) => {
  if (getState().auth.token !== token) return
  // Outra aba pode já ter autenticado um novo usuário.
  if (tokenStorage.get() !== token) {
    dispatch(sincronizarSessao())
    return
  }
  tokenStorage.clear()
  dispatch(sessaoEncerrada(true))
}

export const sincronizarSessao = (): AuthThunk => (dispatch, getState) => {
  const token = tokenStorage.get()
  if (!token) {
    if (getState().auth.token) dispatch(sessaoEncerrada(false))
    return
  }
  const sessao = authService.sessaoDoToken(token)
  if (!sessao) {
    tokenStorage.clear()
    dispatch(sessaoEncerrada(true))
  } else if (token !== getState().auth.token) {
    dispatch(sessaoSincronizada({ token, ...sessao }))
  }
}

export default authSlice.reducer
