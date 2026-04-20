'use client'

import { useEffect, useState, useCallback } from 'react'
import { getChildren } from '@/lib/api'
import type { ChildrenResponse, Filters } from '@/types'
import { FiltersPanel } from '@/components/children/FiltersPanel'
import { ChildCard } from '@/components/children/ChildCard'
import { Pagination } from '@/components/children/Pagination'
import { Loader2, Users } from 'lucide-react'

const DEFAULT_FILTERS: Filters = {
  bairro: 'todos',
  alertas: 'todos',
  revisado: 'todos',
  page: 1,
}

export default function ChildrenPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [response, setResponse] = useState<ChildrenResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchChildren = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getChildren(filters)
      setResponse(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  function handleFilterChange(newFilters: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Crianças Acompanhadas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {response ? (
            <>
              <span className="font-medium text-foreground">{response.total}</span> criança
              {response.total !== 1 ? 's' : ''} encontrada{response.total !== 1 ? 's' : ''}
            </>
          ) : (
            'Carregando...'
          )}
        </p>
      </div>

      <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-24 text-destructive">{error}</div>
      ) : response?.data.length === 0 ? (
        <div className="text-center py-24">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma criança encontrada com esses filtros.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {response?.data.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>

          {response && response.totalPages > 1 && (
            <Pagination
              currentPage={response.page}
              totalPages={response.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
