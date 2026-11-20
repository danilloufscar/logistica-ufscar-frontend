import * as S from './styles'

/**
 * concluido: etapa registrada · ocorrencia: registro sem mudança de status (RF14)
 * cancelado: pedido cancelado · proximo/pendente: etapas que ainda não aconteceram.
 */
export type SituacaoEtapa = 'concluido' | 'ocorrencia' | 'cancelado' | 'proximo' | 'pendente'

export interface EtapaLinhaDoTempo {
  chave: string
  titulo: string
  situacao: SituacaoEtapa
  /** Data, hora e responsável, ou a observação de uma etapa futura. */
  detalhe?: string
  /** Texto livre, como a descrição de uma ocorrência. */
  descricao?: string
}

/** Linha do tempo com marcadores, no padrão dos protótipos (RF13). */
export function LinhaDoTempo({ etapas, rotulo }: { etapas: readonly EtapaLinhaDoTempo[]; rotulo: string }) {
  return (
    <S.Lista aria-label={rotulo}>
      {etapas.map((etapa) => (
        <li key={etapa.chave} data-situacao={etapa.situacao}>
          <S.Marcador $situacao={etapa.situacao} aria-hidden="true" />
          <div>
            <strong>{etapa.titulo}</strong>
            {etapa.detalhe && <S.Detalhe>{etapa.detalhe}</S.Detalhe>}
            {etapa.descricao && <S.Descricao>{etapa.descricao}</S.Descricao>}
          </div>
        </li>
      ))}
    </S.Lista>
  )
}
