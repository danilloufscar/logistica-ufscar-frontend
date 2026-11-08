import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`

export const PrimaryLink = styled(Link)`
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  margin-top: 0 !important;
  min-height: 44px;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.colors.destaque};
  color: ${({ theme }) => theme.colors.branco};
  text-decoration: none;
  font-weight: 600;
  &:hover { background: ${({ theme }) => theme.colors.destaqueHover}; color: ${({ theme }) => theme.colors.branco}; }
`

export const Button = styled.button`
  min-height: 44px;
  padding: 11px 18px;
  border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.colors.branco};
  color: ${({ theme }) => theme.colors.texto};
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.fundoHover}; }
  &:disabled { opacity: .65; cursor: wait; }
`

export const PrimaryButton = styled(Button)`
  border-color: ${({ theme }) => theme.colors.destaque};
  background: ${({ theme }) => theme.colors.destaque};
  color: ${({ theme }) => theme.colors.branco};
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.destaqueHover}; }
`

export const ListPanel = styled.div`
  margin-top: 28px;
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.cartao};
  background: ${({ theme }) => theme.colors.branco};
  overflow: hidden;
`

export const ListStatus = styled.div`
  padding: 32px 24px;
  h2 { margin-bottom: 10px; }
  button { margin-top: 20px; }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  caption { text-align: left; padding: 20px 24px; font-weight: 600; }
  th { text-align: left; background: ${({ theme }) => theme.colors.fundo}; font-size: 13px; }
  th, td { padding: 16px 24px; border-top: 1px solid ${({ theme }) => theme.colors.borda}; overflow-wrap: anywhere; }
  th:first-child { width: 29%; }
  th:nth-child(2) { width: 44%; }
  th:last-child { width: 27%; }
  @media (max-width: 600px) {
    display: block;
    caption { display: block; padding: 16px; }
    thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    tbody { display: block; }
    tbody tr { display: grid; padding: 16px; border-top: 1px solid ${({ theme }) => theme.colors.borda}; }
    td { display: grid; grid-template-columns: 48px minmax(0, 1fr); gap: 12px; padding: 5px 0; border: 0; }
    td::before { content: attr(data-label); font-size: 12px; color: ${({ theme }) => theme.colors.textoSecundario}; }
  }
`

export const Profile = styled.span`
  color: ${({ theme }) => theme.colors.textoSobreDestaqueClaro};
  font-weight: 600;
`

export const FormPanel = styled.div`
  max-width: 760px;
  margin-top: 28px;
  padding: 28px;
  background: ${({ theme }) => theme.colors.branco};
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.cartao};
  @media (max-width: 600px) { padding: 20px; }
`

export const Form = styled.form`
  display: grid;
  gap: 24px;
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 24px; min-width: 0; }
  fieldset:disabled { opacity: .7; }
`

export const Field = styled.div`
  display: grid;
  gap: 8px;
  label { font-weight: 600; font-size: 13px; }
  input, select {
    width: 100%; min-width: 0; min-height: 44px;
    padding: 11px 12px;
    border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
    border-radius: ${({ theme }) => theme.radius.campo};
    background: ${({ theme }) => theme.colors.branco};
    color: ${({ theme }) => theme.colors.texto};
  }
  input[aria-invalid='true'], select[aria-invalid='true'] { border-color: ${({ theme }) => theme.colors.obrigatorio}; }
  p { margin: 0; font-size: 13px; line-height: 1.5; }
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.obrigatorio} !important;
`

export const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  font-weight: 400 !important;
  input { width: 18px; height: 18px; min-height: 0; }
`
