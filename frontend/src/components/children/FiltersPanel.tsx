'use client'

import { useState, useEffect } from 'react'
import type { Filters } from '@/types'
import { Filter, X, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const BAIRROS = [
  'todos','Acari','Anchieta','Bangu','Campo Grande','Complexo do Alemão',
  'Cosmos','Guadalupe','Jacarepaguá','Madureira','Padre Miguel','Pavuna',
  'Realengo','Rocinha','Santa Cruz','Vigário Geral',
]

interface Props {
  filters: Filters
  onFilterChange: (f: Partial<Filters>) => void
}

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
          <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          Filtros
          {activeCount > 0 && (
            <Badge variant="default" className="px-1.5 py-0.5 text-xs">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 px-2 text-xs">
            <X className="w-3 h-3 mr-1" aria-hidden="true" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Nome */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="filter-nome">Buscar por nome</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input
              id="filter-nome"
              type="text"
              value={nomeInput}
              onChange={(e) => setNomeInput(e.target.value)}
              placeholder="Nome da criança..."
              className="pl-8"
            />
          </div>
        </div>

        {/* Bairro */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-bairro">Bairro</Label>
          <Select value={filters.bairro} onValueChange={(val) => onFilterChange({ bairro: val })}>
            <SelectTrigger id="filter-bairro">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os bairros</SelectItem>
              {BAIRROS.filter(b => b !== 'todos').map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Alertas */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-alertas">Alertas</Label>
          <Select value={alertasValue} onValueChange={handleAlertasChange}>
            <SelectTrigger id="filter-alertas">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="true">Com alertas ativos</SelectItem>
              <SelectItem value="false">Sem alertas</SelectItem>
              <SelectItem value="semDados">⊘ Sem dados cadastrados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Área */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-area">Área de alerta</Label>
          <Select
            value={filters.semDados === 'true' ? 'todos' : (filters.area ?? 'todos')}
            onValueChange={(val) => onFilterChange({ area: val, semDados: undefined })}
            disabled={filters.semDados === 'true'}
          >
            <SelectTrigger id="filter-area">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as áreas</SelectItem>
              <SelectItem value="saude">⚕ Saúde</SelectItem>
              <SelectItem value="educacao">📚 Educação</SelectItem>
              <SelectItem value="social">🤝 Assist. Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Revisão */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-revisado">Revisão</Label>
          <Select value={filters.revisado} onValueChange={(val) => onFilterChange({ revisado: val })}>
            <SelectTrigger id="filter-revisado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="false">Pendentes</SelectItem>
              <SelectItem value="true">Revisados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
