import { configureStore } from '@reduxjs/toolkit'
import { definirAcaoSessaoExpirada } from '@/services/api'
import authReducer, { expirarSessao } from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Token expirado ou inválido: volta para o login.
definirAcaoSessaoExpirada((token) => {
  store.dispatch(expirarSessao(token))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
