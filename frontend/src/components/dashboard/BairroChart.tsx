'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Summary } from '@/types'

interface Props {
  summary: Summary
}

export function BairroChart({ summary }: Props) {
  const data = summary.porBairro
    .slice(0, 8)
    .map((b) => ({
      name: b.bairro.length > 12 ? b.bairro.slice(0, 12) + '…' : b.bairro,
      fullName: b.bairro,
      comAlertas: b.comAlertas,
      semAlertas: b.total - b.comAlertas,
      total: b.total,
    }))

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-card-foreground mb-1">Alertas por Bairro</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Top 8 bairros com mais crianças em alerta
      </p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          Sem dados
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                `${value} criança${value !== 1 ? 's' : ''}`,
                name === 'comAlertas' ? 'Com alertas' : 'Sem alertas',
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            />
            <Bar dataKey="comAlertas" stackId="a" radius={[0, 0, 0, 0]} fill="#f97316" />
            <Bar dataKey="semAlertas" stackId="a" radius={[4, 4, 0, 0]} fill="hsl(var(--muted))" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />
          Com alertas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-muted inline-block border border-border" />
          Sem alertas
        </span>
      </div>
    </div>
  )
}
