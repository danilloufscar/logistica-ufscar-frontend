import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const Shell = styled.div`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: ${({ theme }) => theme.size.menuLateral} minmax(0, 1fr);
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`

export const SkipLink = styled.a`
  position: fixed;
  left: 16px;
  top: -100px;
  z-index: 10;
  background: ${({ theme }) => theme.colors.branco};
  padding: 12px;
  &:focus { top: 12px; }
`

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.borda};
  background: ${({ theme }) => theme.colors.branco};
  @media (max-width: 760px) {
    padding: 20px;
    gap: 20px;
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borda};
  }
`

export const Brand = styled.div`
  padding: 0 12px;
  strong { font-size: 26px; letter-spacing: -0.8px; }
  p { margin-top: 6px; color: ${({ theme }) => theme.colors.textoSecundario}; font-size: 12px; }
`

export const MenuButton = styled.button`
  display: none;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  text-align: left;
  color: ${({ theme }) => theme.colors.texto};
  background: ${({ theme }) => theme.colors.fundo};
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.campo};
  cursor: pointer;
  @media (max-width: 760px) { display: block; }
`

export const Navigation = styled.nav<{ $aberto: boolean }>`
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
  @media (max-width: 760px) { display: ${({ $aberto }) => $aberto ? 'block' : 'none'}; }
`

export const MenuLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.campo};
  color: ${({ theme }) => theme.colors.textoMenu};
  text-decoration: none;
  &:hover { background: ${({ theme }) => theme.colors.fundoHover}; }
  &.active {
    color: ${({ theme }) => theme.colors.textoSobreDestaqueClaro};
    background: ${({ theme }) => theme.colors.destaqueClaro};
    font-weight: 600;
  }
`

export const FutureItem = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 12px;
  color: ${({ theme }) => theme.colors.textoSecundario};
  small { font-size: 11px; }
`

export const Workspace = styled.div`min-width: 0;`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 22px 36px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borda};
  background: ${({ theme }) => theme.colors.branco};
  p { color: ${({ theme }) => theme.colors.textoSecundario}; font-size: 13px; margin-top: 5px; }
  strong { overflow-wrap: anywhere; }
  @media (max-width: 760px) { padding: 20px; }
`

export const ExitButton = styled.button`
  flex-shrink: 0;
  min-height: 44px;
  padding: 10px 18px;
  color: ${({ theme }) => theme.colors.texto};
  background: ${({ theme }) => theme.colors.branco};
  border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
  border-radius: ${({ theme }) => theme.radius.campo};
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.fundoHover}; }
`

export const Main = styled.main`
  padding: 40px 36px;
  max-width: 1200px;
  @media (max-width: 760px) { padding: 28px 20px; }
`
