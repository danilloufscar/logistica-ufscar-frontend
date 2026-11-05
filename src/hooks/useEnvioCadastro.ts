import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'

interface Opcoes<F extends FieldValues> {
  valoresIniciais: F
  primeiroCampo: Path<F>
  enviar: (dados: F, signal: AbortSignal) => Promise<unknown>
  interpretarErro: (erro: unknown) => { mensagem: string; campos: Partial<Record<Path<F>, string>> }
  mensagemSucesso: string
  aoCadastrar: () => void
}

/**
 * Envia um formulário de cadastro sem reenvio automático, associa os erros da API
 * aos campos e, após o sucesso, limpa o formulário para o próximo registro.
 */
export function useEnvioCadastro<F extends FieldValues>(form: UseFormReturn<F>, opcoes: Opcoes<F>) {
  const { valoresIniciais } = opcoes
  const { handleSubmit, reset, setError, setFocus, formState: { isSubmitting } } = form
  const requisicao = useRef<AbortController | null>(null)
  const posEnvio = useRef<{ limpar: boolean; foco: Path<F> } | null>(null)
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  useEffect(() => () => requisicao.current?.abort(), [])

  // Os campos ficam desabilitados durante o envio, então só recebem foco depois dele.
  // keepFieldsRef mantém as referências dos campos, que o reset descartaria até a próxima renderização.
  useEffect(() => {
    const pendente = posEnvio.current
    if (isSubmitting || !pendente) return
    posEnvio.current = null
    if (pendente.limpar) reset(valoresIniciais, { keepFieldsRef: true })
    setFocus(pendente.foco)
  }, [isSubmitting, reset, setFocus, valoresIniciais])

  async function onSubmit(dados: F) {
    if (requisicao.current) return
    const controller = new AbortController()
    requisicao.current = controller
    setErroGeral(null)
    try {
      await opcoes.enviar(dados, controller.signal)
      if (controller.signal.aborted) return
      posEnvio.current = { limpar: true, foco: opcoes.primeiroCampo }
      toast.success(opcoes.mensagemSucesso)
      opcoes.aoCadastrar()
    } catch (erro) {
      if (controller.signal.aborted) return
      const { mensagem, campos } = opcoes.interpretarErro(erro)
      const comErro = Object.keys(campos) as Path<F>[]
      for (const campo of comErro) setError(campo, { type: 'server', message: campos[campo] })
      // Erros já mostrados nos campos dispensam a mensagem geral, que os repetiria.
      if (comErro.length > 0) posEnvio.current = { limpar: false, foco: comErro[0] }
      else setErroGeral(mensagem)
    } finally {
      if (requisicao.current === controller) requisicao.current = null
    }
  }

  return {
    erroGeral,
    limparErroGeral: () => setErroGeral(null),
    aoEnviar: (event: FormEvent<HTMLFormElement>) => { void handleSubmit(onSubmit)(event) },
    cancelar: () => {
      reset(valoresIniciais, { keepFieldsRef: true })
      setErroGeral(null)
    },
  }
}
