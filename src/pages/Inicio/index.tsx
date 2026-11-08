import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContent, Panel } from '@/components/PageContent'
import { useAppSelector } from '@/store/hooks'

export function InicioPage() {
  const usuario = useAppSelector((state) => state.auth.usuario)
  useEffect(() => { document.title = 'Início | SGLU' }, [])
  if (!usuario) return null

  return (
    <PageContent>
      <h1>Bem-vindo, {usuario.nome}</h1>
      <p>Este é seu espaço de trabalho no SGLU. Acesse as áreas disponíveis pelo menu.</p>
      <Panel>
        <h2>Seu acesso</h2>
        <p>Você está conectado como {usuario.perfil === 'ADMINISTRADOR' ? 'Administrador' : 'Operador'}.</p>
        {usuario.perfil === 'ADMINISTRADOR' ? (
          <><p>Seu perfil permite acessar a área de usuários.</p><Link to="/usuarios">Acessar usuários</Link></>
        ) : <p>Seu perfil permite trabalhar nas operações de logística. A gestão de usuários é exclusiva do Administrador.</p>}
      </Panel>
      <Panel>
        <h2>Novas áreas em breve</h2>
        <p>Clientes, produtos e pedidos serão disponibilizados nas próximas etapas.</p>
      </Panel>
    </PageContent>
  )
}
