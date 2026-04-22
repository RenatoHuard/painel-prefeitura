import Link from 'next/link'
import type { ChildListItem } from '@/types'
import { calcularIdade, formatarDataHora } from '@/lib/utils'
import { MapPin, HeartPulse, BookOpen, HandHeart, CheckCircle2, AlertTriangle, CircleSlash } from 'lucide-react'

interface Props { child: ChildListItem }

const areaConfig = {
  saude: { label: 'Saúde', Icon: HeartPulse },
  educacao: { label: 'Educação', Icon: BookOpen },
  assistenciaSocial: { label: 'Social', Icon: HandHeart },
}

function AreaBadge({ status, label, Icon }: { status: string; label: string; Icon: React.ElementType }) {
  const config = {
    ok: {
      cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      dot: 'bg-green-500',
      title: `${label}: sem alertas`,
    },
    alerta: {
      cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500',
      title: `${label}: com alertas`,
    },
    sem_dados: {
      cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20 opacity-60',
      dot: 'bg-gray-400',
      title: `${label}: sem dados cadastrados`,
    },
  }[status] ?? { cls: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground/40', title: label }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${config.cls}`} title={config.title}>
      {status === 'sem_dados'
        ? <CircleSlash className="w-3 h-3" />
        : <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      }
      <Icon className="w-3 h-3" />
      <span className="hidden sm:inline">{label}</span>
    </span>
  )
}

export function ChildCard({ child }: Props) {
  const idade = calcularIdade(child.dataNascimento)
  const semDadosEmTodas = child.areas.saude === 'sem_dados' && child.areas.educacao === 'sem_dados' && child.areas.assistenciaSocial === 'sem_dados'

  return (
    <Link
      href={`/children/${child.id}`}
      className="block bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Ver detalhes de ${child.nome}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${semDadosEmTodas ? 'bg-gray-500/10 text-gray-400' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
            {child.nome.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-card-foreground text-sm truncate">{child.nome}</p>
            <p className="text-xs text-muted-foreground">{idade} anos</p>
          </div>
        </div>

        {semDadosEmTodas ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-xs border border-gray-500/20 flex-shrink-0">
            <CircleSlash className="w-3 h-3" /> sem dados
          </span>
        ) : child.alertasCount > 0 ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex-shrink-0">
            <AlertTriangle className="w-3 h-3" /> {child.alertasCount}
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs border border-green-500/20 flex-shrink-0">
            ✓ ok
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <MapPin className="w-3 h-3 flex-shrink-0" />
        <span>{child.bairro}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(Object.entries(areaConfig) as [keyof typeof areaConfig, typeof areaConfig[keyof typeof areaConfig]][]).map(
          ([key, { label, Icon }]) => (
            <AreaBadge key={key} status={child.areas[key]} label={label} Icon={Icon} />
          )
        )}
      </div>

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
