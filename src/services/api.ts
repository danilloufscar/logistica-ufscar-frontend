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
