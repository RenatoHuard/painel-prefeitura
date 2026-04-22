'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Summary } from '@/types'

interface Props {
  summary: Summary
}

const COLORS = ['#ef4444', '#a855f7', '#f97316']
const LABELS = ['Saúde', 'Educação', 'Assist. Social']

export function AlertsChart({ summary }: Props) {
  const data = [
    { name: 'Saúde', value: summary.porArea.saude },
    { name: 'Educação', value: summary.porArea.educacao },
    { name: 'Assist. Social', value: summary.porArea.assistenciaSocial },
  ].filter((d) => d.value > 0)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-card-foreground mb-1">Alertas por Área</h2>
      <p className="text-xs text-muted-foreground mb-4">
        {total} alerta{total !== 1 ? 's' : ''} distribuído{total !== 1 ? 's' : ''} entre as áreas
      </p>

      {total === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          Sem alertas no momento
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} crianças`, '']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom legend com percentuais legíveis */}
          <div className="flex flex-col gap-2 mt-2">
            {data.map((entry, index) => {
              const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0
              return (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-card-foreground">{entry.value}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
