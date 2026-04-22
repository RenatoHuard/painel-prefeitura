'use client'

import type { Filters } from '@/types'
import { Filter, X } from 'lucide-react'

const BAIRROS = [
  'todos','Acari','Anchieta','Bangu','Campo Grande','Complexo do Alemão',
  'Cosmos','Guadalupe','Jacarepaguá','Madureira','Padre Miguel','Pavuna',
  'Realengo','Rocinha','Santa Cruz','Vigário Geral',
]

interface Props {
  filters: Filters
  onFilterChange: (f: Partial<Filters>) => void
}

const selectCls = "w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"

export function FiltersPanel({ filters, onFilterChange }: Props) {
  const activeCount = [
    filters.bairro !== 'todos',
    filters.alertas !== 'todos',
    filters.revisado !== 'todos',
    (filters.area ?? 'todos') !== 'todos',
  ].filter(Boolean).length

  function reset() {
    onFilterChange({ bairro: 'todos', alertas: 'todos', revisado: 'todos', area: 'todos' })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Filter className="w-4 h-4 text-muted-foreground" />
          Filtros
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Bairro */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-bairro">Bairro</label>
          <select id="filter-bairro" value={filters.bairro} onChange={(e) => onFilterChange({ bairro: e.target.value })} className={selectCls}>
            {BAIRROS.map((b) => <option key={b} value={b}>{b === 'todos' ? 'Todos os bairros' : b}</option>)}
          </select>
        </div>

        {/* Área de alerta */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-area">Área</label>
          <select
            id="filter-area"
            value={filters.area ?? 'todos'}
            onChange={(e) => {
              const val = e.target.value
              // Se escolher área específica, limpa o filtro genérico de alertas
              onFilterChange({ area: val, alertas: val !== 'todos' ? 'todos' : filters.alertas })
            }}
            className={selectCls}
          >
            <option value="todos">Todas as áreas</option>
            <option value="saude">⚕ Alertas de Saúde</option>
            <option value="educacao">📚 Alertas de Educação</option>
            <option value="social">🤝 Alertas Assist. Social</option>
          </select>
        </div>

        {/* Alertas genérico */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-alertas">Alertas</label>
          <select
            id="filter-alertas"
            value={filters.alertas}
            onChange={(e) => {
              // Se escolher filtro genérico, limpa a área específica
              onFilterChange({ alertas: e.target.value, area: 'todos' })
            }}
            className={selectCls}
          >
            <option value="todos">Todos</option>
            <option value="true">Com alertas ativos</option>
            <option value="false">Sem alertas</option>
          </select>
        </div>

        {/* Revisado */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-revisado">Revisão</label>
          <select id="filter-revisado" value={filters.revisado} onChange={(e) => onFilterChange({ revisado: e.target.value })} className={selectCls}>
            <option value="todos">Todos</option>
            <option value="false">Pendentes</option>
            <option value="true">Revisados</option>
          </select>
        </div>
      </div>
    </div>
  )
}
