import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { mensagemDeErro, tokenStorage } from '@/services/api'
import * as authService from '@/services/authService'
import type { Usuario } from '@/types/auth'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  carregando: boolean
  erro: string | null
}

function estadoInicial(): AuthState {
  const token = tokenStorage.get()
  const usuario = token ? authService.usuarioDoToken(token) : null
  if (token && !usuario) tokenStorage.clear()
  return { token: usuario ? token : null, usuario, carregando: false, erro: null }
}

export const entrar = createAsyncThunk<
  { token: string; usuario: Usuario },
  { email: string; senha: string },
  { rejectValue: string }
>('auth/entrar', async ({ email, senha }, { rejectWithValue }) => {
  try {
    const token = await authService.login(email, senha)
    const usuario = authService.usuarioDoToken(token)
    if (!usuario) return rejectWithValue('Sessão inválida. Tente entrar de novo.')
    tokenStorage.set(token)
    return { token, usuario }
  } catch (erro) {
    return rejectWithValue(mensagemDeErro(erro, 'E-mail ou senha incorretos'))
  }
})

export const sair = createAsyncThunk('auth/sair', async () => {
  tokenStorage.clear()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: estadoInicial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(entrar.pending, (state) => {
        state.carregando = true
        state.erro = null
      })
      .addCase(entrar.fulfilled, (state, action) => {
        state.carregando = false
        state.token = action.payload.token
        state.usuario = action.payload.usuario
      })
      .addCase(entrar.rejected, (state, action) => {
        state.carregando = false
        state.erro = action.payload ?? 'Não foi possível entrar.'
      })
      .addCase(sair.fulfilled, (state) => {
        state.token = null
        state.usuario = null
        state.erro = null
      })
  },
})

export default authSlice.reducer
