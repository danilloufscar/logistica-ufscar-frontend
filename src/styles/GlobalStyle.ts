import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.texto.size};
    color: ${({ theme }) => theme.colors.texto};
    background: ${({ theme }) => theme.colors.fundo};
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: ${({ theme }) => theme.colors.destaque};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.destaqueHover};
  }

  h1, h2, h3, p {
    margin: 0;
  }

  button, input, select, textarea {
    font: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.destaque};
    outline-offset: 2px;
  }
`
