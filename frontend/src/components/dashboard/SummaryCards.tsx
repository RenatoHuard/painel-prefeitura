'use client'

import { useRouter } from 'next/navigation'
import type { Summary } from '@/types'
import { Users, AlertTriangle, CheckCircle2, HeartPulse, BookOpen, HandHeart, DatabaseZap } from 'lucide-react'

interface Props { summary: Summary }

export function SummaryCards({ summary }: Props) {
  const router = useRouter()

  const cards = [
    { label: 'Total de Crianças', value: summary.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', href: '/children' },
    { label: 'Com Alertas Ativos', value: summary.comAlertas, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', sub: `${Math.round((summary.comAlertas / summary.total) * 100)}% do total`, href: '/children?alertas=true' },
    { label: 'Casos Revisados', value: summary.revisadas, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', sub: `${summary.total - summary.revisadas} pendentes`, href: '/children?revisado=true' },
    { label: 'Sem Dados em Nenhuma Área', value: summary.semDados, icon: DatabaseZap, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', sub: 'Requer cadastramento', href: '/children' },
  ]

  const areCards = [
    { label: 'Alertas — Saúde', value: summary.porArea.saude, icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-500/10', href: '/children?area=saude' },
    { label: 'Alertas — Educação', value: summary.porArea.educacao, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '/children?area=educacao' },
    { label: 'Alertas — Assist. Social', value: summary.porArea.assistenciaSocial, icon: HandHeart, color: 'text-orange-500', bg: 'bg-orange-500/10', href: '/children?area=social' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card) => (
          <button key={card.label} onClick={() => router.push(card.href)}
            className={`bg-card border ${card.border ?? 'border-border'} rounded-xl p-4 md:p-5 text-left hover:shadow-md hover:scale-[1.02] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground leading-tight">{card.label}</p>
                <p className={`text-2xl md:text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                {card.sub && <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>}
              </div>
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground/50 mt-2 group-hover:text-muted-foreground transition-colors">Ver lista →</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {areCards.map((card) => (
          <button key={card.label} onClick={() => router.push(card.href)}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 text-left hover:shadow-md hover:scale-[1.02] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group">
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <span className="text-xs text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
