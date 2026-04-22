'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Summary } from '@/types'

interface Props { summary: Summary }

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#f1f5f9',
}

export function BairroChart({ summary }: Props) {
  const data = summary.porBairro.slice(0, 8).map((b) => ({
    name: b.bairro.length > 12 ? b.bairro.slice(0, 12) + '…' : b.bairro,
    comAlertas: b.comAlertas,
    semAlertas: b.total - b.comAlertas,
  }))

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-card-foreground mb-1">Alertas por Bairro</h2>
      <p className="text-xs text-muted-foreground mb-4">Top 8 bairros com mais crianças em alerta</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Sem dados</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: '#f1f5f9' }}
              labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
              cursor={{ fill: 'rgba(148,163,184,0.1)' }}
            />
            <Bar dataKey="comAlertas" name="Com alertas" stackId="a" fill="#f97316" />
            <Bar dataKey="semAlertas" name="Sem alertas" stackId="a" radius={[4, 4, 0, 0]} fill="#334155" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />Com alertas</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />Sem alertas</span>
      </div>
    </div>
  )
}
