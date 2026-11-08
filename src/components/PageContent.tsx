import styled from 'styled-components'

export const PageContent = styled.section`
  h1 { font-size: ${({ theme }) => theme.font.titulo.size}; line-height: 1.3; }
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; line-height: 1.4; }
  p { margin-top: 12px; color: ${({ theme }) => theme.colors.textoSecundario}; line-height: 1.7; }
  a { display: inline-block; margin-top: 20px; font-weight: 600; }
`

export const Panel = styled.div`
  margin-top: 28px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.cartao};
  background: ${({ theme }) => theme.colors.branco};
  @media (max-width: 760px) { padding: 22px; }
`
