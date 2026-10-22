// Tokens do protótipo no Figma (arquivo "Protótipos SGLU").
// Os nomes seguem os estilos de cor e de texto criados lá.

export const theme = {
  colors: {
    destaque: '#4F46E5',
    destaqueHover: '#4338CA',
    destaqueClaro: '#EEF2FF',
    textoSobreDestaqueClaro: '#3730A3',
    fundo: '#F6F7F9',
    branco: '#FFFFFF',
    borda: '#E3E6EA',
    bordaCampo: '#CDD2D8',
    texto: '#1A1D21',
    textoSecundario: '#5B6470',
    textoMenu: '#3D4652',
    fundoHover: '#F1F3F5',
    linhaTabela: '#EEF0F3',
    obrigatorio: '#B42318',
  },
  status: {
    CRIADO: { fundo: '#EEF0F3', texto: '#3D4652' },
    EM_SEPARACAO: { fundo: '#FEF3C7', texto: '#92400E' },
    DESPACHADO: { fundo: '#DBEAFE', texto: '#1E40AF' },
    EM_TRANSITO: { fundo: '#CFFAFE', texto: '#155E75' },
    ENTREGUE: { fundo: '#DCFCE7', texto: '#166534' },
    CANCELADO: { fundo: '#F3F4F6', texto: '#4B5563' },
    ATRASADO: { fundo: '#FEE2E2', texto: '#991B1B' },
  },
  font: {
    family: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    titulo: { size: '26px', weight: 700 },
    subtitulo: { size: '18px', weight: 600 },
    texto: { size: '14px', weight: 400 },
    textoForte: { size: '14px', weight: 600 },
    rotulo: { size: '13px', weight: 600 },
    legenda: { size: '12px', weight: 400 },
    grupoMenu: { size: '11px', weight: 600 },
  },
  radius: {
    campo: '8px',
    cartao: '12px',
    pilula: '999px',
  },
  size: {
    controle: '44px',
    menuLateral: '220px',
  },
} as const

export type Theme = typeof theme
export type StatusVisual = keyof Theme['status']
