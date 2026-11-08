import { useEffect } from 'react'
import { PageContent } from '@/components/PageContent'
import { useUsuarios } from '@/hooks/useUsuarios'
import * as S from './styles'

export function UsuariosPage() {
  const { dados, erro, carregando, atualizar } = useUsuarios()
  useEffect(() => { document.title = 'Usuários | SGLU' }, [])

  return (
    <PageContent>
      <S.Header>
        <div><h1>Usuários</h1><p>Consulte os usuários e gerencie o acesso ao sistema.</p></div>
        <S.Actions>
          <S.Button type="button" onClick={atualizar} disabled={carregando}>Atualizar lista</S.Button>
          <S.PrimaryLink to="/usuarios/novo">Novo usuário</S.PrimaryLink>
        </S.Actions>
      </S.Header>
      <S.ListPanel aria-busy={carregando}>
        {carregando && <S.ListStatus role="status">Carregando usuários…</S.ListStatus>}
        {erro && <S.ListStatus><h2>Não foi possível carregar a lista</h2><S.ErrorText role="alert">{erro}</S.ErrorText><S.Button type="button" onClick={atualizar}>Tentar novamente</S.Button></S.ListStatus>}
        {dados?.length === 0 && <S.ListStatus><h2>Nenhum usuário cadastrado</h2><p>Use “Novo usuário” para realizar o primeiro cadastro.</p></S.ListStatus>}
        {dados && dados.length > 0 && (
          <S.Table>
            <caption>{dados.length} {dados.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}</caption>
            <thead><tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Perfil</th></tr></thead>
            <tbody>{dados.map((usuario) => (
              <tr key={usuario.id}>
                <td data-label="Nome">{usuario.nome}</td><td data-label="E-mail">{usuario.email}</td>
                <td data-label="Perfil"><S.Profile>{usuario.perfil === 'ADMINISTRADOR' ? 'Administrador' : 'Operador'}</S.Profile></td>
              </tr>
            ))}</tbody>
          </S.Table>
        )}
      </S.ListPanel>
    </PageContent>
  )
}
