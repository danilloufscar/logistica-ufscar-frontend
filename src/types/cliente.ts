export interface Cliente {
  id: number
  nome: string
  telefone: string
  endereco: string
}

export type CadastroCliente = Omit<Cliente, 'id'>

export type CampoCadastroCliente = keyof CadastroCliente
