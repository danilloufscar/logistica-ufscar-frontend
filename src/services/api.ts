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
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A store registra aqui o que fazer quando a sessão expira (resposta 401).
let aoPerderSessao: (() => void) | null = null
export function definirAcaoSessaoExpirada(acao: () => void) {
  aoPerderSessao = acao
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (axios.isAxiosError(erro) && erro.response?.status === 401 && tokenStorage.get()) {
      aoPerderSessao?.()
    }
    return Promise.reject(erro)
  },
)

/** Extrai uma mensagem legível de um erro da API. */
export function mensagemDeErro(erro: unknown, padrao = 'Não foi possível concluir a operação.'): string {
  if (axios.isAxiosError(erro)) {
    if (!erro.response) return 'Não foi possível conectar ao servidor.'
    const corpo = erro.response.data as { mensagem?: string; message?: string } | undefined
    return corpo?.mensagem ?? corpo?.message ?? padrao
  }
  return padrao
}
