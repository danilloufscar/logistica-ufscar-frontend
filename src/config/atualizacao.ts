/** RNF04: margem para consultar e renderizar dentro do limite de 30 segundos. */
export const INTERVALO_ATUALIZACAO_MS = 10_000
/** Menor que o intervalo: uma consulta lenta termina antes do próximo ciclo. */
export const TIMEOUT_ATUALIZACAO_MS = 8_000
