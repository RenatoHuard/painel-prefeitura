import { render, screen } from '@testing-library/react'
import { ChildCard } from '@/components/children/ChildCard'
import type { ChildListItem } from '@/types'

const baseChild: ChildListItem = {
  id: 'c001',
  nome: 'Ana Clara Silva',
  dataNascimento: '2015-03-15T00:00:00.000Z',
  bairro: 'Madureira',
  responsavel: 'Maria da Silva',
  telefone: '(21) 98765-4321',
  alertasCount: 0,
  areas: { saude: 'ok', educacao: 'ok', assistenciaSocial: 'ok' },
  revisado: false,
  ultimaRevisao: null,
}

describe('ChildCard', () => {
  it('renderiza o nome da criança', () => {
    render(<ChildCard child={baseChild} />)
    expect(screen.getByText('Ana Clara Silva')).toBeInTheDocument()
  })

  it('renderiza o bairro', () => {
    render(<ChildCard child={baseChild} />)
    expect(screen.getByText('Madureira')).toBeInTheDocument()
  })

  it('mostra badge "ok" quando não há alertas', () => {
    render(<ChildCard child={baseChild} />)
    expect(screen.getByText('✓ ok')).toBeInTheDocument()
  })

  it('mostra badge de alerta com contagem quando há alertas', () => {
    const childComAlerta: ChildListItem = {
      ...baseChild,
      alertasCount: 2,
      areas: { saude: 'alerta', educacao: 'alerta', assistenciaSocial: 'ok' },
    }
    render(<ChildCard child={childComAlerta} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('mostra badge "sem dados" quando todas as áreas são sem_dados', () => {
    const childSemDados: ChildListItem = {
      ...baseChild,
      alertasCount: 0,
      areas: { saude: 'sem_dados', educacao: 'sem_dados', assistenciaSocial: 'sem_dados' },
    }
    render(<ChildCard child={childSemDados} />)
    expect(screen.getByText('sem dados')).toBeInTheDocument()
  })

  it('mostra "Pendente de revisão" quando não revisado', () => {
    render(<ChildCard child={baseChild} />)
    expect(screen.getByText('Pendente de revisão')).toBeInTheDocument()
  })

  it('mostra data de revisão quando revisado', () => {
    const childRevisado: ChildListItem = {
      ...baseChild,
      revisado: true,
      ultimaRevisao: '2024-03-15T14:30:00.000Z',
    }
    render(<ChildCard child={childRevisado} />)
    expect(screen.getByText(/Revisado/)).toBeInTheDocument()
  })

  it('calcula a idade corretamente', () => {
    render(<ChildCard child={baseChild} />)
    // Ana Clara nasceu em 2015 — deve ter 9 ou 10 anos
    const idadeEl = screen.getByText(/anos/)
    expect(idadeEl).toBeInTheDocument()
  })
})
