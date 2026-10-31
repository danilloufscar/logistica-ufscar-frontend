import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/Login'
import { InicioPage } from '@/pages/Inicio'
import { UsuariosPage } from '@/pages/Usuarios'
import { NaoEncontradaPage } from '@/pages/NaoEncontrada'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PERFIS_ADMINISTRACAO } from './navigation'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: '/', element: <InicioPage /> },
        {
          element: <ProtectedRoute perfis={PERFIS_ADMINISTRACAO} />,
          children: [{ path: '/usuarios', element: <UsuariosPage /> }],
        },
        { path: '*', element: <NaoEncontradaPage /> },
      ],
    }],
  },
])
