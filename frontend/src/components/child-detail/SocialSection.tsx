import type { ChildDetail } from '@/types'
import { HandHeart, Hash, Gift, Activity } from 'lucide-react'
import { NoDados, Alertas } from './HealthSection'

type Props = { assistenciaSocial: ChildDetail['assistenciaSocial'] }

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null

  const config = {
    ativo: { label: 'Ativo', cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
    suspenso: { label: 'Suspenso', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    cancelado: { label: 'Cancelado', cls: 'bg-destructive/10 text-destructive border-destructive/20' },
  }[status.toLowerCase()] ?? { label: status, cls: 'bg-muted text-muted-foreground border-border' }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${config.cls}`}>
      {config.label}
    </span>
  )
}

export function SocialSection({ assistenciaSocial }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <HandHeart className="w-4 h-4 text-orange-500" />
        </div>
        <h2 className="font-semibold text-card-foreground">Assist. Social</h2>
        {assistenciaSocial && assistenciaSocial.alertas.length > 0 && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs border border-destructive/20">
            {assistenciaSocial.alertas.length} alerta{assistenciaSocial.alertas.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!assistenciaSocial ? (
        <NoDados area="assistência social" />
      ) : (
        <div className="space-y-3">
          {assistenciaSocial.nis && (
            <div className="flex items-start gap-2 text-sm">
              <Hash className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">NIS</p>
                <p className="text-card-foreground font-mono text-xs">{assistenciaSocial.nis}</p>
              </div>
            </div>
          )}

          {assistenciaSocial.beneficios.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Gift className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Benefícios</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {assistenciaSocial.beneficios.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {assistenciaSocial.statusBeneficios && (
            <div className="flex items-start gap-2 text-sm">
              <Activity className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Status dos benefícios</p>
                <div className="mt-1">
                  <StatusBadge status={assistenciaSocial.statusBeneficios} />
                </div>
              </div>
            </div>
          )}

          <Alertas alertas={assistenciaSocial.alertas} />
        </div>
      )}
    </div>
  )
}
