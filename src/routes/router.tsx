import { AjusteEstoquePage } from '@/pages/Estoque/AjusteEstoquePage'
import { MovimentacoesEstoquePage } from '@/pages/Estoque/MovimentacoesEstoquePage'
import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/Login'
import { AcompanhamentoPage } from '@/pages/Acompanhamento'
import { InicioPage } from '@/pages/Inicio'
import { EntradaEstoquePage } from '@/pages/Estoque/EntradaEstoquePage'
import { SaldoEstoquePage } from '@/pages/Estoque/SaldoEstoquePage'
import { UsuariosPage } from '@/pages/Usuarios'
import { NovoUsuarioPage } from '@/pages/Usuarios/NovoUsuarioPage'
import { CadastrosPage } from '@/pages/Cadastros'
import { ClientesAba } from '@/pages/Cadastros/ClientesAba'
import { ProdutosAba } from '@/pages/Cadastros/ProdutosAba'
import { PedidosPage } from '@/pages/Pedidos'
import { DetalhePedidoPage } from '@/pages/Pedidos/DetalhePedido'
import { RegistrarOcorrenciaPage } from '@/pages/Pedidos/RegistrarOcorrencia'
import { EntregasPage } from '@/pages/Entregas'
import { EditarPedidoPage, NovoPedidoPage } from '@/pages/Pedidos/FormularioPedido'
import { NaoEncontradaPage } from '@/pages/NaoEncontrada'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PERFIS_ADMINISTRACAO } from './navigation'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/acompanhamento', element: <AcompanhamentoPage /> },
  { path: '/acompanhamento/:codigo', element: <AcompanhamentoPage /> },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: '/', element: <InicioPage /> },
        { path: '/estoque/entradas', element: <EntradaEstoquePage /> },
        { path: '/estoque', element: <SaldoEstoquePage /> },
        { path: '/estoque/produtos/:produtoId/movimentacoes', element: <MovimentacoesEstoquePage /> },
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
        { path: '/pedidos/:id/ocorrencias/nova', element: <RegistrarOcorrenciaPage /> },
        { path: '/entregas', element: <EntregasPage /> },
        {
          element: <ProtectedRoute perfis={PERFIS_ADMINISTRACAO} />,
          children: [
            { path: '/estoque/ajustes', element: <AjusteEstoquePage /> },
            { path: '/usuarios', element: <UsuariosPage /> },
            { path: '/usuarios/novo', element: <NovoUsuarioPage /> },
          ],
        },
        { path: '*', element: <NaoEncontradaPage /> },
      ],
    }],
  },
])
