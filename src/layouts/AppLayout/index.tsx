import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { navigationItems } from '@/routes/navigation'
import { sair } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import * as S from './styles'

export function AppLayout() {
  const usuario = useAppSelector((state) => state.auth.usuario)
  const dispatch = useAppDispatch()
  const [menuAberto, setMenuAberto] = useState(false)
  if (!usuario) return null

  return (
    <S.Shell>
      <S.SkipLink href="#conteudo">Ir para o conteúdo</S.SkipLink>
      <S.Sidebar>
        <S.Brand><strong>SGLU</strong><p>Logística UFSCar</p></S.Brand>
        <S.MenuButton type="button" aria-controls="menu-principal" aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}>
          {menuAberto ? 'Fechar menu' : 'Abrir menu'}
        </S.MenuButton>
        <S.Navigation id="menu-principal" aria-label="Navegação principal" $aberto={menuAberto}>
          <ul>
            {navigationItems.filter((item) => !item.perfis || item.perfis.includes(usuario.perfil)).map((item) => (
              <li key={item.nome}>
                {item.caminho ? (
                  <S.MenuLink to={item.caminho} end={item.caminho === '/'} onClick={() => setMenuAberto(false)}>
                    {item.nome}
                  </S.MenuLink>
                ) : <S.FutureItem aria-disabled="true">{item.nome}<small>Em breve</small></S.FutureItem>}
              </li>
            ))}
          </ul>
        </S.Navigation>
      </S.Sidebar>
      <S.Workspace>
        <S.Header>
          <div><strong>{usuario.nome}</strong><p>{usuario.perfil === 'ADMINISTRADOR' ? 'Administrador' : 'Operador'}</p></div>
          <S.ExitButton type="button" onClick={() => dispatch(sair())}>Sair</S.ExitButton>
        </S.Header>
        <S.Main id="conteudo" tabIndex={-1}><Outlet /></S.Main>
      </S.Workspace>
    </S.Shell>
  )
}
