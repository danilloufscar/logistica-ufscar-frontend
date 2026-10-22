export type Perfil = 'ADMINISTRADOR' | 'OPERADOR'

export interface Usuario {
  id: number
  nome: string
  email: string
  perfil: Perfil
}
