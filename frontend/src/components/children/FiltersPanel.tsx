'use client'

import { useState, useEffect } from 'react'
import type { Filters } from '@/types'
import { Filter, X, Search } from 'lucide-react'

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
  const [nomeInput, setNomeInput] = useState(filters.nome ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nomeInput !== (filters.nome ?? '')) {
        onFilterChange({ nome: nomeInput })
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [nomeInput])

  useEffect(() => { setNomeInput(filters.nome ?? '') }, [filters.nome])

  // Valor composto para o select de alertas (inclui semDados)
  const alertasValue = filters.semDados === 'true' ? 'semDados' : filters.alertas

  function handleAlertasChange(val: string) {
    if (val === 'semDados') {
      onFilterChange({ semDados: 'true', alertas: 'todos', area: 'todos' })
    } else {
      onFilterChange({ alertas: val, semDados: undefined, area: 'todos' })
    }
  }

  const activeCount = [
    (filters.nome ?? '') !== '',
    filters.bairro !== 'todos',
    alertasValue !== 'todos',
    (filters.area ?? 'todos') !== 'todos',
    filters.revisado !== 'todos',
  ].filter(Boolean).length

  function reset() {
    setNomeInput('')
    onFilterChange({ bairro: 'todos', alertas: 'todos', revisado: 'todos', area: 'todos', nome: '', semDados: undefined })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Filter className="w-4 h-4 text-muted-foreground" />
          Filtros
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Nome */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-nome">Buscar por nome</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="filter-nome" type="text" value={nomeInput}
              onChange={(e) => setNomeInput(e.target.value)}
              placeholder="Nome da criança..."
              className="w-full pl-8 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Bairro */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-bairro">Bairro</label>
          <select id="filter-bairro" value={filters.bairro} onChange={(e) => onFilterChange({ bairro: e.target.value })} className={selectCls}>
            {BAIRROS.map((b) => <option key={b} value={b}>{b === 'todos' ? 'Todos os bairros' : b}</option>)}
          </select>
        </div>

        {/* Alertas — inclui "Sem dados" */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-alertas">Alertas</label>
          <select id="filter-alertas" value={alertasValue} onChange={(e) => handleAlertasChange(e.target.value)} className={selectCls}>
            <option value="todos">Todos</option>
            <option value="true">Com alertas ativos</option>
            <option value="false">Sem alertas</option>
            <option value="semDados">⊘ Sem dados cadastrados</option>
          </select>
        </div>

        {/* Área — só visível quando alertas = com alertas ou todos */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-area">Área de alerta</label>
          <select
            id="filter-area"
            value={filters.semDados === 'true' ? 'todos' : (filters.area ?? 'todos')}
            onChange={(e) => onFilterChange({ area: e.target.value, semDados: undefined })}
            disabled={filters.semDados === 'true'}
            className={`${selectCls} disabled:opacity-40`}
          >
            <option value="todos">Todas as áreas</option>
            <option value="saude">⚕ Saúde</option>
            <option value="educacao">📚 Educação</option>
            <option value="social">🤝 Assist. Social</option>
          </select>
        </div>

        {/* Revisão */}
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
