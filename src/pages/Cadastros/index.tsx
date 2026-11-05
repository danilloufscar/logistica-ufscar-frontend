import { Outlet } from 'react-router-dom'
import * as S from './styles'

export function CadastrosPage() {
  return (
    <S.Page aria-labelledby="cadastros-titulo">
      <S.Eyebrow>Cadastros</S.Eyebrow>
      <h1 id="cadastros-titulo">Clientes e Produtos</h1>
      <S.Tabs aria-label="Cadastros">
        <ul>
          <li><S.Tab to="/clientes">Clientes</S.Tab></li>
          <li><S.Tab to="/produtos">Produtos</S.Tab></li>
        </ul>
      </S.Tabs>
      <Outlet />
    </S.Page>
  )
}
