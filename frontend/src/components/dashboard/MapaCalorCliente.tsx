'use client'

import { useEffect, useRef } from 'react'
import type { Summary } from '@/types'
import { RIO_BAIRROS_GEOJSON } from '@/lib/rioGeoJson'

interface Props { summary: Summary }

function getColor(alertas: number, total: number): string {
  if (total === 0) return '#334155'
  const pct = alertas / total
  if (pct === 0)   return '#166534'
  if (pct <= 0.25) return '#15803d'
  if (pct <= 0.50) return '#ca8a04'
  if (pct <= 0.75) return '#ea580c'
  return '#dc2626'
}

const escala = [
  { cor: '#dc2626', label: '>75% com alertas' },
  { cor: '#ea580c', label: '51–75%' },
  { cor: '#ca8a04', label: '26–50%' },
  { cor: '#15803d', label: '1–25%' },
  { cor: '#166534', label: 'Sem alertas' },
  { cor: '#334155', label: 'Sem dados' },
]

export default function MapaCalorCliente({ summary }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) return // já inicializado

    // Importa Leaflet dinamicamente (só no cliente)
    import('leaflet').then((L) => {
      if (!mapRef.current) return

      // Fix ícones
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [-22.900, -43.450],
        zoom: 11,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      // Lookup bairro → dados
      const bairroMap = new Map(
        summary.porBairro.map((b) => [
          b.bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
          b
        ])
      )

      L.geoJSON(RIO_BAIRROS_GEOJSON as GeoJSON.GeoJsonObject, {
        style: (feature) => {
          const nome = feature?.properties?.nome ?? ''
          const key = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          const dados = bairroMap.get(key) ?? { total: 0, comAlertas: 0 }
          return {
            fillColor: getColor(dados.comAlertas, dados.total),
            fillOpacity: 0.75,
            color: '#1e293b',
            weight: 1.5,
          }
        },
        onEachFeature: (feature, layer) => {
          const nome = feature?.properties?.nome ?? ''
          const key = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          const dados = bairroMap.get(key) ?? { total: 0, comAlertas: 0 }
          const pct = dados.total > 0 ? Math.round((dados.comAlertas / dados.total) * 100) : 0

          layer.bindTooltip(
            `<div style="font-family:sans-serif;font-size:12px;padding:4px 8px;line-height:1.6;background:#1e293b;color:#f1f5f9;border:1px solid #334155;border-radius:6px">
              <strong>${nome}</strong><br/>
              ${dados.total} criança${dados.total !== 1 ? 's' : ''}<br/>
              ${dados.comAlertas} com alerta${dados.comAlertas !== 1 ? 's' : ''} (${pct}%)
            </div>`,
            { sticky: true, opacity: 1, className: 'leaflet-tooltip-custom' }
          )
        }
      }).addTo(map)
    })

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [summary])

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-card-foreground mb-1">Mapa de Calor por Bairro</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Passe o mouse sobre o bairro para ver os detalhes
      </p>

      <div
        ref={mapRef}
        className="rounded-lg overflow-hidden"
        style={{ height: '360px', zIndex: 0 }}
      />

      <div className="flex flex-wrap gap-3 mt-4">
        {escala.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.cor }} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
