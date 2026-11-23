import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const Container = styled.main`
  min-height: 100vh;
  background: ${theme.colors.branco};
  color: ${theme.colors.texto};
  font-family: ${theme.font.family};
  padding: 48px 16px;
`

export const Conteudo = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
`

export const Topo = styled.header`
  h1 {
    margin: 0;
    font-size: ${theme.font.titulo.size};
    font-weight: ${theme.font.titulo.weight};
    line-height: 1.3;
  }
  p { margin-top: 6px; color: ${theme.colors.textoSecundario}; line-height: 1.5; }
`

export const FormBusca = styled.form`
  display: grid;
  gap: 8px;
  label { font-size: ${theme.font.rotulo.size}; font-weight: ${theme.font.rotulo.weight}; }
  div { display: flex; flex-wrap: wrap; gap: 12px; }
  input {
    flex: 1 1 240px;
    min-width: 0;
    height: ${theme.size.controle};
    padding: 0 12px;
    border: 1px solid ${theme.colors.bordaCampo};
    border-radius: ${theme.radius.campo};
    font: inherit;
    font-size: ${theme.font.texto.size};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  input::placeholder { text-transform: none; letter-spacing: normal; color: ${theme.colors.textoSecundario}; }
`

export const AvisoErro = styled.p`
  padding: 12px 14px;
  border: 1px solid ${theme.colors.obrigatorio};
  border-radius: ${theme.radius.campo};
  color: ${theme.colors.obrigatorio};
  line-height: 1.5;
`

export const Cartao = styled.section`
  padding: 28px;
  border: 1px solid ${theme.colors.borda};
  border-radius: ${theme.radius.cartao};
  background: ${theme.colors.branco};
  h2 { margin: 28px 0 20px; font-size: ${theme.font.texto.size}; font-weight: ${theme.font.textoForte.weight}; }
  @media (max-width: 600px) { padding: 20px; }
`

export const Resumo = styled.dl`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  margin: 0;
  dt {
    margin-bottom: 8px;
    font-size: ${theme.font.grupoMenu.size};
    font-weight: ${theme.font.grupoMenu.weight};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${theme.colors.textoSecundario};
  }
  dd { margin: 0; }
  div:last-child { text-align: right; }
  @media (max-width: 600px) { div:last-child { text-align: left; } }
`

export const Prazo = styled.dd`
  font-size: ${theme.font.subtitulo.size};
  font-weight: ${theme.font.subtitulo.weight};
`

export const Rodape = styled.p`
  font-size: ${theme.font.legenda.size};
  line-height: 1.5;
  color: ${theme.colors.textoSecundario};
`
