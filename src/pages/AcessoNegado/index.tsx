import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContent, Panel } from '@/components/PageContent'

export function AcessoNegadoPage() {
  useEffect(() => { document.title = 'Acesso negado | SGLU' }, [])
  return (
    <PageContent>
      <h1>Acesso negado</h1>
      <Panel>
        <h2>Esta área não está disponível para seu perfil</h2>
        <p>Você continua conectado e pode acessar as demais áreas disponíveis no menu.</p>
        <Link to="/">Voltar ao início</Link>
      </Panel>
    </PageContent>
  )
}
