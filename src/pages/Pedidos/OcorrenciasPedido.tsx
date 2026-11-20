import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ErrorText, Field, PrimaryButton } from '@/components/ui'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { erroDeOcorrencia, registrarOcorrencia, TIPOS_OCORRENCIA, type DadosOcorrencia, type Ocorrencia } from '@/services/ocorrenciaService'
import { hojeEmSaoPaulo } from '@/utils/pedido'
import * as S from './styles'

export function OcorrenciasPedido({ pedidoId, encerrado, aoRegistrar }: { pedidoId: number; encerrado: boolean; aoRegistrar: () => void }) {
  const [ultima, setUltima] = useState<Ocorrencia | null>(null)
  return <S.Cartao aria-labelledby="ocorrencias-titulo">
    <h2 id="ocorrencias-titulo">Ocorrências do pedido</h2>
    {encerrado ? <p>Pedido encerrado. Não é possível registrar novas ocorrências.</p> : <FormularioOcorrencia pedidoId={pedidoId} aoSalvar={ocorrencia => {
      setUltima(ocorrencia)

      aoRegistrar()
    }} />}
    {ultima && <p role="status">Registrada: {TIPOS_OCORRENCIA[ultima.tipoOcorrencia]} — {ultima.descricao}. O registro não altera o status do pedido.</p>}
  </S.Cartao>
}

function FormularioOcorrencia({ pedidoId, aoSalvar }: { pedidoId: number; aoSalvar: (resultado: Ocorrencia) => void }) {
  const inicial = useMemo<DadosOcorrencia>(() => ({ tipo: 'ATRASO', descricao: '', data: hojeEmSaoPaulo() }), [])
  const form = useForm<DadosOcorrencia>({ defaultValues: inicial })
  const { register, formState: { errors, isSubmitting } } = form
  const { aoEnviar, erroGeral, limparErroGeral, cancelar } = useEnvioCadastro(form, {
    valoresIniciais: inicial, primeiroCampo: 'tipo',
    enviar: (dados, signal) => registrarOcorrencia(pedidoId, { ...dados, descricao: dados.descricao.trim() }, signal),
    interpretarErro: erroDeOcorrencia, mensagemSucesso: 'Ocorrência registrada. O status foi preservado.', aoCadastrar: aoSalvar,
  })
  return <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
    <p>Informe o ocorrido. Todos os campos são obrigatórios; o registro não altera o status do pedido.</p>
    {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
    <fieldset disabled={isSubmitting}>
      <Field>
        <label htmlFor="ocorrencia-tipo">Tipo da ocorrência</label>
        <select id="ocorrencia-tipo" aria-required="true" aria-invalid={!!errors.tipo} aria-describedby={errors.tipo ? 'ocorrencia-tipo-erro' : undefined} {...register('tipo', { required: 'Selecione o tipo.' })}>
          {Object.entries(TIPOS_OCORRENCIA).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
        </select>
        {errors.tipo && <ErrorText id="ocorrencia-tipo-erro" role="alert">{errors.tipo.message}</ErrorText>}
      </Field>
      <Field>
        <label htmlFor="ocorrencia-data">Data da ocorrência</label>
        <input id="ocorrencia-data" type="date" aria-required="true" aria-invalid={!!errors.data} aria-describedby={errors.data ? 'ocorrencia-data-erro' : undefined} {...register('data', { required: 'Informe a data.' })} />
        {errors.data && <ErrorText id="ocorrencia-data-erro" role="alert">{errors.data.message}</ErrorText>}
      </Field>
      <Field>
        <label htmlFor="ocorrencia-descricao">Descrição</label>
        <textarea id="ocorrencia-descricao" rows={4} maxLength={500} aria-required="true" aria-invalid={!!errors.descricao} aria-describedby={errors.descricao ? 'ocorrencia-descricao-erro' : undefined} {...register('descricao', {
          setValueAs: (valor: string) => valor.trim(), required: 'Descreva a ocorrência.', maxLength: { value: 500, message: 'Use até 500 caracteres.' },
        })} />
        {errors.descricao && <ErrorText id="ocorrencia-descricao-erro" role="alert">{errors.descricao.message}</ErrorText>}
      </Field>
    </fieldset>
    <S.Acoes>
      <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando…' : 'Registrar ocorrência'}</PrimaryButton>
      <Button type="button" disabled={isSubmitting} onClick={cancelar}>Limpar campos</Button>
    </S.Acoes>
  </S.Form>
}
