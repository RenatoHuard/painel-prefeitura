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
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
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
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
