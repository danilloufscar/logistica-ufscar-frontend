/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (padrão: /api). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
