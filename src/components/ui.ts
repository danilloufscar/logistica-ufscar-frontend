import styled, { css } from 'styled-components'
import { theme } from '@/styles/theme'

export const ocultoVisualmente = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`

export const cartao = css`
  min-width: 0;
  background: ${({ theme }) => theme.colors.branco};
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.cartao};
`

/** Página com sobretítulo (Eyebrow) e título no padrão do protótipo. */
export const Page = styled.section`
  h1 {
    font-size: ${({ theme }) => theme.font.titulo.size};
    font-weight: ${({ theme }) => theme.font.titulo.weight};
    line-height: 1.3;
  }
`

export const Eyebrow = styled.p`
  margin-bottom: 4px;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
`

export const Button = styled.button`
  min-height: ${({ theme }) => theme.size.controle};
  padding: 11px 18px;
  border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.colors.branco};
  color: ${({ theme }) => theme.colors.texto};
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.fundoHover}; }
  &:disabled { opacity: 0.65; cursor: wait; }
`

export const PrimaryButton = styled(Button)`
  border-color: ${({ theme }) => theme.colors.destaque};
  background: ${({ theme }) => theme.colors.destaque};
  color: ${({ theme }) => theme.colors.branco};
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.destaqueHover}; }
`

export const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.font.rotulo.size};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.obrigatorio};
`

const seta = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5l3 3 3-3' fill='none' stroke='${theme.colors.textoSecundario}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
)}")`

/** Rótulo e campo (input ou select) empilhados. */
export const Field = styled.div`
  display: grid;
  gap: 8px;
  label { font-size: ${({ theme }) => theme.font.rotulo.size}; font-weight: ${({ theme }) => theme.font.rotulo.weight}; }
  input, select {
    width: 100%;
    min-width: 0;
    min-height: ${({ theme }) => theme.size.controle};
    padding: 11px 12px;
    border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
    border-radius: ${({ theme }) => theme.radius.campo};
    background-color: ${({ theme }) => theme.colors.branco};
    color: ${({ theme }) => theme.colors.texto};
  }
  select {
    appearance: none;
    padding-right: 36px;
    background-image: ${seta};
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: pointer;
  }
  input::placeholder { color: ${({ theme }) => theme.colors.textoSecundario}; }
  input[autocapitalize='characters'] { text-transform: uppercase; }
  input[autocapitalize='characters']::placeholder { text-transform: none; }
  input[aria-invalid='true'], select[aria-invalid='true'] { border-color: ${({ theme }) => theme.colors.obrigatorio}; }
`
