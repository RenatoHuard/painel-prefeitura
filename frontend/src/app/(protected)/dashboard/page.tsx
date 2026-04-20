'use client'

import { useEffect, useState } from 'react'
import { getSummary } from '@/lib/api'
import type { Summary } from '@/types'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { AlertsChart } from '@/components/dashboard/AlertsChart'
import { BairroChart } from '@/components/dashboard/BairroChart'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-destructive">Erro ao carregar dados: {error}</p>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel Geral</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão consolidada do acompanhamento de crianças
        </p>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AlertsChart summary={summary} />
        <BairroChart summary={summary} />
      </div>
    </div>
  )
}
