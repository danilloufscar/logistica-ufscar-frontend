import { useEffect } from 'react'
import { PageContent, Panel } from '@/components/PageContent'

// Apenas a área reservada e sua autorização. A listagem e o cadastro são a próxima etapa.
export function UsuariosPage() {
  useEffect(() => { document.title = 'Usuários | SGLU' }, [])
  return (
    <PageContent>
      <h1>Usuários</h1>
      <p>Área exclusiva do Administrador.</p>
      <Panel>
        <h2>Gestão de usuários em breve</h2>
        <p>O cadastro e a listagem de usuários estarão disponíveis nesta área.</p>
      </Panel>
    </PageContent>
  )
}
