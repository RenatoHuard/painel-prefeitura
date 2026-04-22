'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { getChildren } from '@/lib/api'
import type { ChildrenResponse, Filters } from '@/types'
import { FiltersPanel } from '@/components/children/FiltersPanel'
import { ChildCard } from '@/components/children/ChildCard'
import { Pagination } from '@/components/children/Pagination'
import { Loader2, Users, CircleSlash } from 'lucide-react'

export default function ChildrenPage() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<Filters>({
    bairro: searchParams.get('bairro') || 'todos',
    alertas: searchParams.get('alertas') || 'todos',
    revisado: searchParams.get('revisado') || 'todos',
    area: searchParams.get('area') || 'todos',
    nome: searchParams.get('nome') || '',
    semDados: searchParams.get('semDados') || undefined,
    page: 1,
  })

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

  useEffect(() => { fetchChildren() }, [fetchChildren])

  function handleFilterChange(newFilters: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const mostraSemDados = filters.semDados === 'true'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Crianças Acompanhadas</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-muted-foreground text-sm">
            {response ? (
              <><span className="font-medium text-foreground">{response.total}</span> criança{response.total !== 1 ? 's' : ''} encontrada{response.total !== 1 ? 's' : ''}</>
            ) : 'Carregando...'}
          </p>
          {mostraSemDados && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-xs border border-rose-500/20">
              <CircleSlash className="w-3 h-3" /> Sem dados cadastrados
            </span>
          )}
        </div>
      </div>

      {mostraSemDados ? (
        /* Banner explicativo quando filtro semDados está ativo */
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <CircleSlash className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Crianças sem dados em nenhuma área</p>
            <p className="text-xs text-muted-foreground mt-0.5">Estas crianças não possuem registros de saúde, educação ou assistência social. É necessário realizar o cadastramento nas áreas responsáveis.</p>
            <button
              onClick={() => handleFilterChange({ semDados: undefined, alertas: 'todos', area: 'todos' })}
              className="text-xs text-rose-500 hover:underline mt-1"
            >
              Limpar filtro →
            </button>
          </div>
        </div>
      ) : (
        <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
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
            {response?.data.map((child) => <ChildCard key={child.id} child={child} />)}
          </div>
          {response && response.totalPages > 1 && (
            <Pagination currentPage={response.page} totalPages={response.totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  )
}
