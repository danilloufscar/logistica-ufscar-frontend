import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { definirAcaoAcessoNegado } from '@/services/api'
import { expirarSessao, sincronizarSessao } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function SessionObserver() {
  const { token, expiraEm } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => definirAcaoAcessoNegado(() => {
    toast.error('Você não tem permissão para realizar esta ação.', { toastId: 'acesso-negado' })
  }), [])

  useEffect(() => {
    const sincronizar = () => dispatch(sincronizarSessao())
    const aoVoltar = () => { if (document.visibilityState === 'visible') sincronizar() }
    const aoMudarStorage = (event: StorageEvent) => {
      if (event.storageArea === localStorage) sincronizar()
    }
    window.addEventListener('focus', sincronizar)
    window.addEventListener('storage', aoMudarStorage)
    document.addEventListener('visibilitychange', aoVoltar)
    return () => {
      window.removeEventListener('focus', sincronizar)
      window.removeEventListener('storage', aoMudarStorage)
      document.removeEventListener('visibilitychange', aoVoltar)
    }
  }, [dispatch])

  useEffect(() => {
    if (!token || expiraEm === null) return
    let timer: ReturnType<typeof setTimeout>
    const verificar = () => {
      const restante = expiraEm - Date.now()
      if (restante <= 0) dispatch(expirarSessao(token))
      else timer = setTimeout(verificar, Math.min(restante, 2_147_483_647))
    }
    verificar()
    return () => clearTimeout(timer)
  }, [dispatch, token, expiraEm])

  return null
}
