import { useEffect, useId, useRef, type ReactNode } from 'react'
import styled from 'styled-components'
import { Button, DangerButton } from '@/components/ui'

const Dialogo = styled.dialog`
  width: min(440px, calc(100vw - 32px));
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.borda};
  border-radius: ${({ theme }) => theme.radius.cartao};
  background: ${({ theme }) => theme.colors.branco};
  color: ${({ theme }) => theme.colors.texto};
  &::backdrop { background: rgb(26 29 33 / 45%); }
  h2 { font-size: ${({ theme }) => theme.font.subtitulo.size}; font-weight: ${({ theme }) => theme.font.subtitulo.weight}; }
  p { margin-top: 10px; line-height: 1.6; color: ${({ theme }) => theme.colors.textoSecundario}; }
`

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`

interface Props {
  aberto: boolean
  titulo: string
  children: ReactNode
  confirmar: string
  aoConfirmar: () => void
  aoFechar: () => void
}

/** Confirmação de ação destrutiva. Usa o <dialog> nativo: prende o foco, fecha com Esc e devolve o foco ao sair. */
export function DialogoConfirmacao({ aberto, titulo, children, confirmar, aoConfirmar, aoFechar }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const voltar = useRef<HTMLButtonElement>(null)
  const id = useId()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) {
      dialogo.showModal()
      // Foco na opção segura, para Enter não confirmar sem querer.
      voltar.current?.focus()
    }
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <Dialogo ref={ref} aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-texto`} onClose={aoFechar}>
      <h2 id={`${id}-titulo`}>{titulo}</h2>
      <p id={`${id}-texto`}>{children}</p>
      <Acoes>
        <Button ref={voltar} type="button" onClick={aoFechar}>Voltar</Button>
        <DangerButton type="button" onClick={aoConfirmar}>{confirmar}</DangerButton>
      </Acoes>
    </Dialogo>
  )
}
