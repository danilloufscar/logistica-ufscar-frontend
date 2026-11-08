import { Button, ButtonLink, ErrorText } from '@/components/ui'
import * as S from './styles'

interface Props {
  textoCarregando: string
  erro: string | null
  carregando: boolean
  aoTentarNovamente: () => void
}

/** Carregamento ou erro de uma página de pedido, com caminho de volta à lista. */
export function EstadoConsulta({ textoCarregando, erro, carregando, aoTentarNovamente }: Props) {
  if (!erro || carregando) return <S.Estado role="status">{textoCarregando}</S.Estado>
  return (
    <S.Estado>
      <h2>Não foi possível carregar</h2>
      <ErrorText role="alert">{erro}</ErrorText>
      <Button type="button" onClick={aoTentarNovamente}>Tentar novamente</Button>
      <ButtonLink to="/pedidos">Voltar aos pedidos</ButtonLink>
    </S.Estado>
  )
}

export function PedidoNaoEncontrado() {
  return (
    <S.Estado>
      <h2>Pedido não encontrado</h2>
      <p>Confira o endereço ou volte à lista de pedidos.</p>
      <ButtonLink to="/pedidos">Voltar aos pedidos</ButtonLink>
    </S.Estado>
  )
}
