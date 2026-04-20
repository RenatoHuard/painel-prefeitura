import Link from 'next/link'
import type { ChildListItem } from '@/types'
import { calcularIdade, formatarDataHora } from '@/lib/utils'
import { MapPin, HeartPulse, BookOpen, HandHeart, CheckCircle2, AlertTriangle } from 'lucide-react'

interface Props {
  child: ChildListItem
}

const areaConfig = {
  saude: { label: 'Saúde', Icon: HeartPulse },
  educacao: { label: 'Educação', Icon: BookOpen },
  assistenciaSocial: { label: 'Social', Icon: HandHeart },
}

function AreaBadge({ status, label, Icon }: { status: string; label: string; Icon: React.ElementType }) {
  const styles = {
    ok: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    alerta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    sem_dados: 'bg-muted text-muted-foreground border-border',
  }[status] ?? 'bg-muted text-muted-foreground border-border'

  const dot = {
    ok: 'bg-green-500',
    alerta: 'bg-amber-500',
    sem_dados: 'bg-muted-foreground/40',
  }[status] ?? 'bg-muted-foreground/40'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${styles}`}
      title={status === 'sem_dados' ? `${label}: sem dados cadastrados` : label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <Icon className="w-3 h-3" />
      <span className="hidden sm:inline">{label}</span>
    </span>
  )
}

export function ChildCard({ child }: Props) {
  const idade = calcularIdade(child.dataNascimento)

  return (
    <Link
      href={`/children/${child.id}`}
      className="block bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Ver detalhes de ${child.nome}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm group-hover:bg-primary/20 transition-colors">
            {child.nome.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-card-foreground text-sm truncate">{child.nome}</p>
            <p className="text-xs text-muted-foreground">{idade} anos</p>
          </div>
        </div>

        {child.alertasCount > 0 ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex-shrink-0">
            <AlertTriangle className="w-3 h-3" />
            {child.alertasCount}
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs border border-green-500/20 flex-shrink-0">
            ✓ ok
          </span>
        )}
      </div>

      {/* Bairro */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <MapPin className="w-3 h-3 flex-shrink-0" />
        <span>{child.bairro}</span>
      </div>

      {/* Area badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(Object.entries(areaConfig) as [keyof typeof areaConfig, typeof areaConfig[keyof typeof areaConfig]][]).map(
          ([key, { label, Icon }]) => (
            <AreaBadge key={key} status={child.areas[key]} label={label} Icon={Icon} />
          )
        )}
      </div>

      {/* Review status */}
      <div className="pt-2 border-t border-border">
        {child.revisado && child.ultimaRevisao ? (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3" />
            Revisado {formatarDataHora(child.ultimaRevisao)}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-full border border-muted-foreground/50 inline-block" />
            Pendente de revisão
          </div>
        )}
      </div>
    </Link>
  )
}
