import type { ReactNode } from 'react'
import { Button, ErrorText } from '@/components/ui'
import * as S from './styles'

export interface Coluna<T> {
  titulo: string
  valor: (item: T) => ReactNode
  alinhamento?: 'direita'
  semQuebra?: boolean
}

interface Props<T> {
  consulta: { dados: readonly T[] | null; erro: string | null; carregando: boolean; atualizar: () => void }
  /** Linhas exibidas (por exemplo, após filtros). Por padrão, todos os dados da consulta. */
  itens?: readonly T[]
  colunas: readonly Coluna<T>[]
  textos: { carregando: string; vazio: string; dicaVazio: string; legenda: (total: number) => string }
  /** Conteúdo extra do estado vazio, como um botão para limpar filtros. */
  acaoVazio?: ReactNode
  /** Destaca a linha (por exemplo, um pedido atrasado). */
  emAlerta?: (item: T) => boolean
  rodape?: ReactNode
}

/** Tabela com estados de carregamento, erro e lista vazia. A primeira coluna identifica a linha. */
export function TabelaDados<T extends { id: number }>({ consulta, itens, colunas, textos, acaoVazio, emAlerta, rodape }: Props<T>) {
  const { dados, erro, carregando, atualizar } = consulta
  const linhas = dados && (itens ?? dados)

  return (
    <S.ListCard aria-busy={carregando}>
      {dados === null && carregando && <S.Status role="status">{textos.carregando}</S.Status>}
      {dados === null && erro && !carregando && (
        <S.Status>
          <h2>Não foi possível carregar a lista</h2>
          <ErrorText role="alert">{erro}</ErrorText>
          <Button type="button" onClick={atualizar}>Tentar novamente</Button>
        </S.Status>
      )}
      {dados && erro && (
        <S.Aviso role="alert">
          <span><strong>Lista desatualizada.</strong> {erro}</span>
          <Button type="button" onClick={atualizar} disabled={carregando}>Tentar novamente</Button>
        </S.Aviso>
      )}
      {linhas?.length === 0 && (
        <S.Status role="status"><h2>{textos.vazio}</h2><p>{textos.dicaVazio}</p>{acaoVazio}</S.Status>
      )}
      {linhas && linhas.length > 0 && (
        <>
          <S.Table>
            <caption>{textos.legenda(linhas.length)}</caption>
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna.titulo} scope="col" data-alinhamento={coluna.alinhamento}>{coluna.titulo}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((item) => (
                <tr key={item.id} data-alerta={emAlerta?.(item) || undefined}>
                  {colunas.map((coluna, indice) => {
                    const Celula = indice === 0 ? 'th' : 'td'
                    return (
                      <Celula key={coluna.titulo} scope={indice === 0 ? 'row' : undefined} data-label={coluna.titulo}
                        data-alinhamento={coluna.alinhamento} data-quebra={coluna.semQuebra ? 'nunca' : undefined}>
                        {coluna.valor(item)}
                      </Celula>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </S.Table>
          {rodape && <S.Rodape role="status">{rodape}</S.Rodape>}
        </>
      )}
    </S.ListCard>
  )
}
