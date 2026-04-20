export type AreaStatus = 'ok' | 'alerta' | 'sem_dados'

export interface ChildListItem {
  id: string
  nome: string
  dataNascimento: string
  bairro: string
  responsavel: string
  telefone: string
  alertasCount: number
  areas: {
    saude: AreaStatus
    educacao: AreaStatus
    assistenciaSocial: AreaStatus
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
    nomeTecnico: string
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

export interface ChildrenResponse {
  data: ChildListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Tecnico {
  id: string
  email: string
  nome: string
}

export interface AuthResponse {
  token: string
  tecnico: Tecnico
}

export interface Filters {
  bairro: string
  alertas: string
  revisado: string
  page: number
}
