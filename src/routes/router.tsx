import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/Login'
import { InicioPage } from '@/pages/Inicio'
import { EntradaEstoquePage } from '@/pages/Estoque/EntradaEstoquePage'
import { UsuariosPage } from '@/pages/Usuarios'
import { NovoUsuarioPage } from '@/pages/Usuarios/NovoUsuarioPage'
import { CadastrosPage } from '@/pages/Cadastros'
import { ClientesAba } from '@/pages/Cadastros/ClientesAba'
import { ProdutosAba } from '@/pages/Cadastros/ProdutosAba'
import { PedidosPage } from '@/pages/Pedidos'
import { DetalhePedidoPage } from '@/pages/Pedidos/DetalhePedido'
import { EditarPedidoPage, NovoPedidoPage } from '@/pages/Pedidos/FormularioPedido'
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
        { path: '/estoque/entradas', element: <EntradaEstoquePage /> },
        {
          element: <CadastrosPage />,
          children: [
            { path: '/clientes', element: <ClientesAba /> },
            { path: '/produtos', element: <ProdutosAba /> },
          ],
        },
        { path: '/pedidos', element: <PedidosPage /> },
        { path: '/pedidos/novo', element: <NovoPedidoPage /> },
        { path: '/pedidos/:id', element: <DetalhePedidoPage /> },
        { path: '/pedidos/:id/editar', element: <EditarPedidoPage /> },
        {
          element: <ProtectedRoute perfis={PERFIS_ADMINISTRACAO} />,
          children: [
            { path: '/usuarios', element: <UsuariosPage /> },
            { path: '/usuarios/novo', element: <NovoUsuarioPage /> },
          ],
        },
        { path: '*', element: <NaoEncontradaPage /> },
      ],
    }],
  },
])
