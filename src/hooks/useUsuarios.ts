import { useEffect, useState } from 'react'
import { listarUsuarios } from '@/services/usuarioService'
import { mensagemDeErro } from '@/services/api'
import type { Usuario } from '@/types/auth'

interface ConsultaUsuarios {
  dados: Usuario[] | null
  erro: string | null
}

export function useUsuarios() {
  const [consulta, setConsulta] = useState<ConsultaUsuarios>({ dados: null, erro: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    listarUsuarios(controller.signal)
      .then((dados) => { if (!controller.signal.aborted) setConsulta({ dados, erro: null }) })
      .catch((erro: unknown) => {
        if (!controller.signal.aborted) setConsulta({ dados: null, erro: mensagemDeErro(erro, 'Não foi possível carregar os usuários.') })
      })
    return () => controller.abort()
  }, [tentativa])

  function atualizar() {
    setConsulta({ dados: null, erro: null })
    setTentativa((valor) => valor + 1)
  }

  return { ...consulta, carregando: consulta.dados === null && consulta.erro === null, atualizar }
}
