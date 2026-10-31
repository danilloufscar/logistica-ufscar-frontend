import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import type { Perfil } from '@/types/auth'
import { AcessoNegadoPage } from '@/pages/AcessoNegado'

export function ProtectedRoute({ perfis }: { perfis?: readonly Perfil[] }) {
  const { usuario, token, expiraEm } = useAppSelector((state) => state.auth)
  if (!usuario || !token || expiraEm === null) {
    return <Navigate to="/login" replace />
  }
  if (perfis && !perfis.includes(usuario.perfil)) return <AcessoNegadoPage />
  return <Outlet />
}
