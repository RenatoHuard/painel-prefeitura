import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FiltersPanel } from '@/components/children/FiltersPanel'
import type { Filters } from '@/types'

const defaultFilters: Filters = {
  bairro: 'todos',
  alertas: 'todos',
  revisado: 'todos',
  area: 'todos',
  nome: '',
  page: 1,
}

describe('FiltersPanel', () => {
  it('renderiza todos os selects', () => {
    const onFilterChange = vi.fn()
    render(<FiltersPanel filters={defaultFilters} onFilterChange={onFilterChange} />)

    expect(screen.getByLabelText('Bairro')).toBeInTheDocument()
    expect(screen.getByLabelText('Alertas')).toBeInTheDocument()
    expect(screen.getByLabelText('Área de alerta')).toBeInTheDocument()
    expect(screen.getByLabelText('Revisão')).toBeInTheDocument()
  })

  it('chama onFilterChange ao mudar bairro', () => {
    const onFilterChange = vi.fn()
    render(<FiltersPanel filters={defaultFilters} onFilterChange={onFilterChange} />)

    fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Madureira' } })
    expect(onFilterChange).toHaveBeenCalledWith({ bairro: 'Madureira' })
  })

  it('chama onFilterChange com semDados=true ao selecionar "Sem dados cadastrados"', () => {
    const onFilterChange = vi.fn()
    render(<FiltersPanel filters={defaultFilters} onFilterChange={onFilterChange} />)

    fireEvent.change(screen.getByLabelText('Alertas'), { target: { value: 'semDados' } })
    expect(onFilterChange).toHaveBeenCalledWith({
      semDados: 'true',
      alertas: 'todos',
      area: 'todos',
    })
  })

  it('desabilita o select de área quando semDados está ativo', () => {
    const onFilterChange = vi.fn()
    const filters = { ...defaultFilters, semDados: 'true' }
    render(<FiltersPanel filters={filters} onFilterChange={onFilterChange} />)

    expect(screen.getByLabelText('Área de alerta')).toBeDisabled()
  })

  it('mostra badge de contagem quando filtros estão ativos', () => {
    const onFilterChange = vi.fn()
    const filters = { ...defaultFilters, bairro: 'Madureira', alertas: 'true' }
    render(<FiltersPanel filters={filters} onFilterChange={onFilterChange} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('mostra botão limpar quando há filtros ativos', () => {
    const onFilterChange = vi.fn()
    const filters = { ...defaultFilters, alertas: 'true' }
    render(<FiltersPanel filters={filters} onFilterChange={onFilterChange} />)

    expect(screen.getByText('Limpar')).toBeInTheDocument()
  })

  it('limpa todos os filtros ao clicar em Limpar', () => {
    const onFilterChange = vi.fn()
    const filters = { ...defaultFilters, alertas: 'true', bairro: 'Bangu' }
    render(<FiltersPanel filters={filters} onFilterChange={onFilterChange} />)

    fireEvent.click(screen.getByText('Limpar'))
    expect(onFilterChange).toHaveBeenCalledWith({
      bairro: 'todos',
      alertas: 'todos',
      revisado: 'todos',
      area: 'todos',
      nome: '',
      semDados: undefined,
    })
  })

  it('dispara busca por nome com debounce', async () => {
    const onFilterChange = vi.fn()
    render(<FiltersPanel filters={defaultFilters} onFilterChange={onFilterChange} />)

    fireEvent.change(screen.getByPlaceholderText('Nome da criança...'), {
      target: { value: 'Ana' },
    })

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({ nome: 'Ana' })
    }, { timeout: 500 })
  })
})
