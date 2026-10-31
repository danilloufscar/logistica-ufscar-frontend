import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContent } from '@/components/PageContent'

export function NaoEncontradaPage() {
  useEffect(() => { document.title = 'Página não encontrada | SGLU' }, [])
  return (
    <PageContent>
      <h1>Página não encontrada</h1>
      <p>Confira o endereço ou use o menu para acessar uma área disponível.</p>
      <Link to="/">Voltar ao início</Link>
    </PageContent>
  )
}
