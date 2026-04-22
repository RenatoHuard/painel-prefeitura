'use client'

import dynamic from 'next/dynamic'
import type { Summary } from '@/types'

// Leaflet não funciona no servidor (usa window/document)
// dynamic com ssr:false garante renderização só no cliente
const MapaCalorCliente = dynamic(
  () => import('./MapaCalorCliente'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-card-foreground mb-1">Mapa de Calor por Bairro</h2>
        <div className="h-80 flex items-center justify-center text-muted-foreground text-sm">
          Carregando mapa...
        </div>
      </div>
    )
  }
)

interface Props { summary: Summary }

export function MapaCalor({ summary }: Props) {
  return <MapaCalorCliente summary={summary} />
}
