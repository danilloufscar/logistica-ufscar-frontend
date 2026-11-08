import type { Perfil } from './auth'

export interface CadastroUsuario {
  nome: string
  email: string
  senha: string
  perfil: Perfil
}

export type CampoCadastroUsuario = keyof CadastroUsuario
