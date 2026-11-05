import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { cartao } from '@/components/ui'

export { Button, ErrorText, Eyebrow, Field, Page, PrimaryButton } from '@/components/ui'

export const Tabs = styled.nav`
  margin-top: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borda};
  ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 4px; }
`

export const Tab = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  min-height: ${({ theme }) => theme.size.controle};
  padding: 0 14px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  color: ${({ theme }) => theme.colors.textoMenu};
  font-weight: 500;
  text-decoration: none;
  &:hover { color: ${({ theme }) => theme.colors.texto}; }
  &.active {
    color: ${({ theme }) => theme.colors.destaque};
    border-bottom-color: ${({ theme }) => theme.colors.destaque};
    font-weight: 600;
  }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
  margin-top: 24px;
  @media (max-width: 1080px) { grid-template-columns: minmax(0, 1fr); }
`

export const FormCard = styled.section`
  ${cartao}
  padding: 24px;
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; }
  @media (max-width: 1080px) { max-width: 640px; }
  @media (max-width: 600px) { padding: 20px; }
`

export const Form = styled.form`
  display: grid;
  gap: 20px;
  margin-top: 20px;
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 16px; min-width: 0; }
  fieldset:disabled { opacity: 0.7; }
`

export const Obrigatorio = styled.span`
  color: ${({ theme }) => theme.colors.obrigatorio};
`

export const Ajuda = styled.p`
  font-size: ${({ theme }) => theme.font.legenda.size};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textoSecundario};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
