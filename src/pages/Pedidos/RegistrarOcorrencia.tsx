import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, ButtonLink, ErrorText, Field, Page, PrimaryButton } from '@/components/ui'
import { useConsulta } from '@/hooks/useConsulta'
import { useEnvioCadastro } from '@/hooks/useEnvioCadastro'
import { buscarPedido } from '@/services/pedidoService'
import { TIPOS_OCORRENCIA, erroDeOcorrencia, registrarOcorrencia, type DadosOcorrencia } from '@/services/ocorrenciaService'
import type { Pedido } from '@/types/pedido'
import { ROTULO_STATUS, hojeEmSaoPaulo, idDePedido } from '@/utils/pedido'
import { EstadoConsulta, PedidoNaoEncontrado } from './EstadoConsulta'
import * as S from './styles'

interface ValoresOcorrencia {
  tipo: DadosOcorrencia['tipo'] | ''
  descricao: string
  data: string
}

/** Tela 12: registrar ocorrência na entrega (RF14). Volta para a tela de onde foi aberta. */
export function RegistrarOcorrenciaPage() {
  const id = idDePedido(useParams().id)
  const [parametros] = useSearchParams()
  useEffect(() => { document.title = 'Registrar ocorrência | SGLU' }, [])

  const doAcompanhamento = parametros.get('origem') === 'entregas'
  const acompanhamento = parametros.get('aba') === 'atrasados' ? '/entregas?aba=atrasados' : '/entregas'
  const voltarPara = !id ? '/pedidos'
    : doAcompanhamento ? `${acompanhamento}${acompanhamento.includes('?') ? '&' : '?'}pedido=${id}` : `/pedidos/${id}`

  return (
    <Page aria-labelledby="ocorrencia-titulo">
      <S.Trilha aria-label="Você está em">
        {doAcompanhamento
          ? <><Link to={acompanhamento}>Acompanhamento</Link> / {id ? <Link to={voltarPara}>Pedido #{id}</Link> : 'Pedido'}</>
          : <><Link to="/pedidos">Pedidos</Link> / {id ? <><Link to={voltarPara}>#{id}</Link> / </> : ''}Registrar ocorrência</>}
      </S.Trilha>
      <h1 id="ocorrencia-titulo">Registrar ocorrência</h1>
      {id ? <ConteudoOcorrencia key={id} id={id} voltarPara={voltarPara} /> : <PedidoNaoEncontrado />}
    </Page>
  )
}

function ConteudoOcorrencia({ id, voltarPara }: { id: number; voltarPara: string }) {
  const carregar = useCallback((signal: AbortSignal) => buscarPedido(id, signal), [id])
  const consulta = useConsulta(carregar, 'Não foi possível carregar o pedido.')
  const pedido = consulta.dados

  if (!pedido) {
    return <EstadoConsulta textoCarregando="Carregando pedido…" erro={consulta.erro}
      carregando={consulta.carregando} aoTentarNovamente={consulta.atualizar} />
  }
  if (pedido.status === 'ENTREGUE' || pedido.status === 'CANCELADO') {
    return (
      <S.Estado>
        <h2>Este pedido não aceita novas ocorrências</h2>
        <p>O pedido #{pedido.id} está com status {ROTULO_STATUS[pedido.status]}.</p>
        <ButtonLink to={voltarPara}>Voltar</ButtonLink>
      </S.Estado>
    )
  }
  return <FormularioOcorrencia pedido={pedido} voltarPara={voltarPara} />
}

function FormularioOcorrencia({ pedido, voltarPara }: { pedido: Pedido; voltarPara: string }) {
  const navigate = useNavigate()
  const inicial = useMemo<ValoresOcorrencia>(() => ({ tipo: '', descricao: '', data: hojeEmSaoPaulo() }), [])
  const form = useForm<ValoresOcorrencia>({ defaultValues: inicial, mode: 'onSubmit', reValidateMode: 'onChange' })
  const { register, formState: { errors, isSubmitting } } = form
  const { aoEnviar, erroGeral, limparErroGeral } = useEnvioCadastro(form, {
    valoresIniciais: inicial,
    primeiroCampo: 'tipo',
    limparAposSucesso: false,
    // A validação garante que o tipo foi escolhido.
    enviar: (valores, signal) => registrarOcorrencia(pedido.id,
      { tipo: valores.tipo as DadosOcorrencia['tipo'], descricao: valores.descricao.trim(), data: valores.data }, signal),
    interpretarErro: erroDeOcorrencia,
    mensagemSucesso: 'Ocorrência registrada. O status do pedido não mudou.',
    aoCadastrar: () => navigate(voltarPara),
  })

  return (
    <S.FormCard>
      <S.Form noValidate onSubmit={aoEnviar} onChange={limparErroGeral} aria-busy={isSubmitting}>
        <S.Contexto>Pedido #{pedido.id} · {pedido.cliente.nome} · {ROTULO_STATUS[pedido.status]}</S.Contexto>
        {erroGeral && <ErrorText role="alert">{erroGeral}</ErrorText>}
        <fieldset disabled={isSubmitting}>
          <S.Opcoes role="radiogroup" aria-required="true" aria-invalid={Boolean(errors.tipo)} aria-describedby={errors.tipo ? 'ocorrencia-tipo-erro' : undefined}>
            <legend>Tipo<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></legend>
            {Object.entries(TIPOS_OCORRENCIA).map(([valor, rotulo]) => (
              <label key={valor}>
                <input type="radio" value={valor} {...register('tipo', { required: 'Selecione o tipo da ocorrência.' })} />
                {rotulo}
              </label>
            ))}
            {errors.tipo && <ErrorText id="ocorrencia-tipo-erro" role="alert">{errors.tipo.message}</ErrorText>}
          </S.Opcoes>
          <Field>
            <label htmlFor="ocorrencia-descricao">Descrição<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="ocorrencia-descricao" maxLength={500} autoComplete="off" aria-required="true"
              aria-invalid={Boolean(errors.descricao)} aria-describedby={errors.descricao ? 'ocorrencia-descricao-erro' : undefined}
              {...register('descricao', {
                setValueAs: (valor: string) => valor.trim(),
                required: 'Descreva a ocorrência.',
                maxLength: { value: 500, message: 'Use até 500 caracteres.' },
              })} />
            {errors.descricao && <ErrorText id="ocorrencia-descricao-erro" role="alert">{errors.descricao.message}</ErrorText>}
          </Field>
          <S.CampoCurto>
            <label htmlFor="ocorrencia-data">Data<S.Obrigatorio aria-hidden="true"> *</S.Obrigatorio></label>
            <input id="ocorrencia-data" type="date" aria-required="true" aria-invalid={Boolean(errors.data)}
              aria-describedby={errors.data ? 'ocorrencia-data-erro' : undefined}
              {...register('data', { required: 'Informe a data da ocorrência.' })} />
            {errors.data && <ErrorText id="ocorrencia-data-erro" role="alert">{errors.data.message}</ErrorText>}
          </S.CampoCurto>
        </fieldset>
        <S.Ajuda>A ocorrência aparece na linha do tempo do pedido e não muda o status.</S.Ajuda>
        <S.Acoes>
          <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando…' : 'Registrar ocorrência'}</PrimaryButton>
          <Button type="button" disabled={isSubmitting} onClick={() => navigate(voltarPara)}>Cancelar</Button>
        </S.Acoes>
      </S.Form>
    </S.FormCard>
  )
}
