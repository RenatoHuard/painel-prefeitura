export interface JwtPayload {
  sub: string
  preferred_username: string
  nome: string
  iat: number
  exp: number
}

export interface ChildListItem {
  id: string
  nome: string
  dataNascimento: string
  bairro: string
  responsavel: string
  telefone: string
  alertasCount: number
  areas: {
    saude: 'ok' | 'alerta' | 'sem_dados'
    educacao: 'ok' | 'alerta' | 'sem_dados'
    assistenciaSocial: 'ok' | 'alerta' | 'sem_dados'
  }
  revisado: boolean
  ultimaRevisao: string | null
}

export interface ChildDetail {
  id: string
  nome: string
  dataNascimento: string
  bairro: string
  responsavel: string
  telefone: string
  saude: {
    cartaoSus: string | null
    ultimaConsulta: string | null
    vacinasEmDia: boolean
    alertas: string[]
  } | null
  educacao: {
    escola: string | null
    serie: string | null
    frequenciaPercentual: number | null
    alertas: string[]
  } | null
  assistenciaSocial: {
    nis: string | null
    beneficios: string[]
    statusBeneficios: string | null
    alertas: string[]
  } | null
  revisoes: Array<{
    id: string
    tecnico: string
    criadoEm: string
  }>
}

export interface Summary {
  total: number
  comAlertas: number
  semDados: number
  revisadas: number
  porArea: {
    saude: number
    educacao: number
    assistenciaSocial: number
  }
  porBairro: Array<{
    bairro: string
    total: number
    comAlertas: number
  }>
}
