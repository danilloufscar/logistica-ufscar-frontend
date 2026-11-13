import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const Container = styled.main`
  min-height: 100vh;
  background: ${theme.colors.fundo};
  color: ${theme.colors.texto};
  font-family: ${theme.font.family};
  padding: 32px 16px 48px;
`

export const Conteudo = styled.div`
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Topo = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  h1 {
    font-size: ${theme.font.titulo.size};
    font-weight: ${theme.font.titulo.weight};
    margin: 0;
  }
`

export const Cartao = styled.section`
  background: ${theme.colors.branco};
  border: 1px solid ${theme.colors.borda};
  border-radius: ${theme.radius.cartao};
  padding: 20px 24px;

  h2 {
    font-size: ${theme.font.subtitulo.size};
    font-weight: ${theme.font.subtitulo.weight};
    margin: 0 0 16px;
  }
`

export const FormBusca = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1 1 240px;
    font-size: ${theme.font.rotulo.size};
    font-weight: ${theme.font.rotulo.weight};
  }

  input {
    height: ${theme.size.controle};
    padding: 0 12px;
    border: 1px solid ${theme.colors.bordaCampo};
    border-radius: ${theme.radius.campo};
    font-size: ${theme.font.texto.size};
    text-transform: uppercase;
  }
`

export const BarraStatusAtualizacao = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: ${theme.font.legenda.size};
  background: ${theme.colors.destaqueClaro};
  color: ${theme.colors.textoSobreDestaqueClaro};
  padding: 10px 14px;
  border-radius: ${theme.radius.campo};
`

export const GradeDados = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 0;

  dt {
    font-size: ${theme.font.legenda.size};
    color: ${theme.colors.textoSecundario};
    margin-bottom: 4px;
  }

  dd {
    margin: 0;
    font-size: ${theme.font.textoForte.size};
    font-weight: ${theme.font.textoForte.weight};
  }
`

export const ListaTimeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;

  li {
    border-left: 3px solid ${theme.colors.destaque};
    padding-left: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  li[data-tipo='OCORRENCIA'] {
    border-left-color: ${theme.colors.obrigatorio};
  }

  strong {
    font-size: ${theme.font.textoForte.size};
  }

  span {
    font-size: ${theme.font.legenda.size};
    color: ${theme.colors.textoSecundario};
  }
`

export const AvisoErro = styled.div`
  background: ${theme.status.ATRASADO.fundo};
  color: ${theme.status.ATRASADO.texto};
  padding: 12px 16px;
  border-radius: ${theme.radius.campo};
  font-size: ${theme.font.texto.size};
`