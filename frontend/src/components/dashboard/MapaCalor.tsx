'use client'

import dynamic from 'next/dynamic'
import type { Summary } from '@/types'

const MapaCalorCliente = dynamic(
  () => import('./MapaCalorCliente'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-card-foreground mb-1">Mapa de Calor por Bairro</h2>
        <div className="h-80 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Carregando mapa...
        </div>
      </div>
    )
  }
)

export function MapaCalor({ summary }: { summary: Summary }) {
  return <MapaCalorCliente summary={summary} />
}
