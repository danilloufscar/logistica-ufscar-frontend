import axios from 'axios'

const TOKEN_KEY = 'sglu.token'

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
})

api.interceptors.request.use((config) => {
  // Um token antigo não pode impedir uma nova autenticação.
  if (config.url === '/auth/login') return config
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A store registra aqui o que fazer quando a sessão expira (resposta 401).
let aoPerderSessao: ((token: string) => void) | null = null
export function definirAcaoSessaoExpirada(acao: (token: string) => void) {
  aoPerderSessao = acao
}

let aoNegarAcesso: (() => void) | null = null
export function definirAcaoAcessoNegado(acao: () => void) {
  aoNegarAcesso = acao
  return () => { aoNegarAcesso = null }
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (axios.isAxiosError(erro) && erro.config?.url !== '/auth/login') {
      const authorization = erro.config?.headers?.Authorization
      const token = typeof authorization === 'string' && authorization.startsWith('Bearer ')
        ? authorization.slice(7) : null
      // Desconsidera respostas de uma sessão anterior, inclusive após um novo login.
      if (token && token === tokenStorage.get()) {
        if (erro.response?.status === 401) aoPerderSessao?.(token)
        if (erro.response?.status === 403) aoNegarAcesso?.()
      }
    }
    return Promise.reject(erro)
  },
)

/** Extrai uma mensagem legível de um erro da API. */
export function mensagemDeErro(erro: unknown, padrao = 'Não foi possível concluir a operação.'): string {
  if (axios.isAxiosError(erro)) {
    if (erro.code === 'ECONNABORTED') return 'O servidor demorou para responder. Tente novamente.'
    if (!erro.response) return 'Não foi possível conectar ao servidor.'
    if (erro.response.status >= 500) return 'O servidor está indisponível no momento. Tente novamente.'
    const corpo = erro.response.data as { mensagem?: string; message?: string } | undefined
    return corpo?.mensagem ?? corpo?.message ?? padrao
  }
  return padrao
}

interface ConflitoConhecido<C extends string> {
  codigo: string
  campo: C
  mensagem: string
}

/**
 * Separa a mensagem geral e os erros por campo de uma falha de cadastro (POST/PUT).
 * `400` usa os `detalhes` da API; o conflito informado (`409`) é associado ao seu campo.
 * `camposConhecidos` lista os campos do formulário ou converte a chave da API no nome do campo
 * (útil para listas, como `itens[1].quantidade`); chaves sem campo correspondente são ignoradas.
 */
export function interpretarErroDeCadastro<C extends string>(
  erro: unknown,
  camposConhecidos: readonly C[] | ((chave: string) => C | undefined),
  padrao: string,
  conflito?: ConflitoConhecido<C>,
): { mensagem: string; campos: Partial<Record<C, string>> } {
  const campos: Partial<Record<C, string>> = {}
  const mensagem = mensagemDeErro(erro, padrao)
  if (!axios.isAxiosError(erro)) return { mensagem, campos }
  if (!erro.response) {
    // Sem resposta, o servidor pode ter gravado o cadastro mesmo assim.
    return { mensagem: 'Não foi possível confirmar o cadastro. Confira a lista antes de tentar novamente.', campos }
  }
  const corpo = erro.response.data as { codigo?: unknown; detalhes?: unknown } | undefined
  if (conflito && erro.response.status === 409 && corpo?.codigo === conflito.codigo) {
    campos[conflito.campo] = conflito.mensagem
  }
  if (erro.response.status === 400 && corpo?.detalhes && typeof corpo.detalhes === 'object') {
    const detalhes = corpo.detalhes as Record<string, unknown>
    const paraCampo = typeof camposConhecidos === 'function'
      ? camposConhecidos
      : (chave: string) => camposConhecidos.find((campo) => campo === chave)
    for (const [chave, mensagemCampo] of Object.entries(detalhes)) {
      const campo = paraCampo(chave)
      if (campo && typeof mensagemCampo === 'string') campos[campo] = mensagemCampo
    }
  }
  return { mensagem, campos }
}
