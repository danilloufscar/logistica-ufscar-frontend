import { TIMEOUT_ATUALIZACAO_MS } from '@/config/atualizacao'
import axios from 'axios'
import type { AcompanhamentoPedido } from '@/types/acompanhamento'

export async function consultarAcompanhamento(
    codigo: string,
    signal?: AbortSignal,
): Promise<AcompanhamentoPedido> {
    const codigoNormalizado = codigo.trim().toUpperCase()
    const { data } = await axios.get<AcompanhamentoPedido>(
        `/api/acompanhamento/${encodeURIComponent(codigoNormalizado)}`,
        {
            signal,
            timeout: TIMEOUT_ATUALIZACAO_MS,
            headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
            },
        },
    )
    return data
}
