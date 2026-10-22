import { configureStore } from '@reduxjs/toolkit'
import { definirAcaoSessaoExpirada } from '@/services/api'
import authReducer, { sair } from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Token expirado ou inválido: volta para o login.
definirAcaoSessaoExpirada(() => {
  void store.dispatch(sair())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
