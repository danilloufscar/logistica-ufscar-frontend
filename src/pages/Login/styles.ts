import styled from 'styled-components'

export const Screen = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: ${({ theme }) => theme.colors.fundo};
`

export const Content = styled.div`
  width: 100%;
  max-width: 440px;
`

export const Brand = styled.div`
  text-align: center;
  margin-bottom: 28px;

  strong { display: block; font-size: 28px; letter-spacing: -1px; }
  p { margin-top: 8px; color: ${({ theme }) => theme.colors.textoSecundario}; line-height: 1.5; }
`

export const BrandIcon = styled.div`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  border-radius: ${({ theme }) => theme.radius.cartao};
  color: ${({ theme }) => theme.colors.branco};
  background: ${({ theme }) => theme.colors.destaque};
`

export const Card = styled.section`
  padding: 32px;
  background: ${({ theme }) => theme.colors.branco};
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.cartao};

  @media (max-width: 380px) { padding: 24px 20px; }
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.titulo.size};
  font-weight: ${({ theme }) => theme.font.titulo.weight};
  line-height: 1.25;
  letter-spacing: -0.5px;
`

export const Description = styled.p`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.textoSecundario};
  line-height: 1.6;
`

export const Form = styled.form`
  display: grid;
  gap: 20px;
  margin-top: 28px;
`

export const Field = styled.div`
  display: grid;
  gap: 8px;

  label { font-weight: 600; font-size: ${({ theme }) => theme.font.rotulo.size}; }
`

export const Input = styled.input`
  width: 100%;
  min-height: ${({ theme }) => theme.size.controle};
  padding: 11px 12px;
  border: 1px solid ${({ theme }) => theme.colors.bordaCampo};
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.colors.branco};
  color: ${({ theme }) => theme.colors.texto};

  &[aria-invalid='true'] { border-color: ${({ theme }) => theme.colors.obrigatorio}; }
  &:disabled { background: ${({ theme }) => theme.colors.fundo}; cursor: wait; }
`

export const PasswordControl = styled.div`
  position: relative;
  input { padding-right: 50px; }
`

export const PasswordToggle = styled.button`
  position: absolute;
  inset: 0 0 0 auto;
  display: grid;
  place-items: center;
  width: 44px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.campo};
  background: transparent;
  color: ${({ theme }) => theme.colors.textoSecundario};
  cursor: pointer;

  &:hover { color: ${({ theme }) => theme.colors.destaque}; }
  &:disabled { cursor: wait; }
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.obrigatorio};
  font-size: ${({ theme }) => theme.font.rotulo.size};
  line-height: 1.5;
`

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: ${({ theme }) => theme.size.controle};
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.campo};
  background: ${({ theme }) => theme.colors.destaque};
  color: ${({ theme }) => theme.colors.branco};
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.destaqueHover}; }
  &:disabled { opacity: 0.7; cursor: wait; }
`

export const Footer = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: ${({ theme }) => theme.font.legenda.size};
  color: ${({ theme }) => theme.colors.textoSecundario};
  line-height: 1.6;
`

export const SessionNotice = styled.p`
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.textoSobreDestaqueClaro};
  line-height: 1.5;
`
