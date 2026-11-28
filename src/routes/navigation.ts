import type { Perfil } from '@/types/auth'

export const PERFIS_ADMINISTRACAO: readonly Perfil[] = ['ADMINISTRADOR']

interface NavigationItem {
  nome: string
  caminho?: string
  perfis?: readonly Perfil[]
}

export const navigationItems: readonly NavigationItem[] = [
  { nome: 'Início', caminho: '/' },
  { nome: 'Usuários', caminho: '/usuarios', perfis: PERFIS_ADMINISTRACAO },
  { nome: 'Clientes', caminho: '/clientes' },
  { nome: 'Produtos', caminho: '/produtos' },
  { nome: 'Entrada de estoque', caminho: '/estoque/entradas' },
  { nome: 'Ajuste de inventário', caminho: '/estoque/ajustes', perfis: PERFIS_ADMINISTRACAO },
  { nome: 'Estoque', caminho: '/estoque' },
  { nome: 'Pedidos', caminho: '/pedidos' },
  { nome: 'Acompanhamento', caminho: '/entregas' },
  { nome: 'Relatórios', caminho: '/relatorios', perfis: PERFIS_ADMINISTRACAO },
]
