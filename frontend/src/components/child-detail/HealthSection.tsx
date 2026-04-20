import type { ChildDetail } from '@/types'
import { HeartPulse, AlertTriangle, CheckCircle2, Calendar, CreditCard, Syringe, Ban } from 'lucide-react'
import { formatarData } from '@/lib/utils'

type Props = { saude: ChildDetail['saude'] }

export function HealthSection({ saude }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
          <HeartPulse className="w-4 h-4 text-red-500" />
        </div>
        <h2 className="font-semibold text-card-foreground">Saúde</h2>
        {saude && saude.alertas.length > 0 && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs border border-destructive/20">
            {saude.alertas.length} alerta{saude.alertas.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!saude ? (
        <NoDados area="saúde" />
      ) : (
        <div className="space-y-3">
          {/* Cartão SUS */}
          {saude.cartaoSus && (
            <div className="flex items-start gap-2 text-sm">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Cartão SUS</p>
                <p className="text-card-foreground font-mono text-xs">{saude.cartaoSus}</p>
              </div>
            </div>
          )}

          {/* Última consulta */}
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Última consulta</p>
              <p className="text-card-foreground">
                {saude.ultimaConsulta ? formatarData(saude.ultimaConsulta) : 'Não registrada'}
              </p>
            </div>
          </div>

          {/* Vacinas */}
          <div className="flex items-start gap-2 text-sm">
            <Syringe className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Vacinas</p>
              <div className="flex items-center gap-1 mt-0.5">
                {saude.vacinasEmDia ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 text-xs">Em dia</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400 text-xs">Atrasadas</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Alertas */}
          <Alertas alertas={saude.alertas} />
        </div>
      )}
    </div>
  )
}

export function NoDados({ area }: { area: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Ban className="w-8 h-8 text-muted-foreground/40 mb-2" />
      <p className="text-sm text-muted-foreground">Sem dados de {area}</p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        Criança não cadastrada nesta área
      </p>
    </div>
  )
}

export function Alertas({ alertas }: { alertas: string[] }) {
  if (alertas.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Sem alertas nesta área
      </div>
    )
  }

  return (
    <div className="space-y-1.5 pt-1 border-t border-border">
      {alertas.map((alerta, i) => (
        <div
          key={i}
          className="flex items-start gap-2 px-2.5 py-2 rounded-md bg-destructive/5 border border-destructive/15"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-destructive leading-relaxed">{alerta}</p>
        </div>
      ))}
    </div>
  )
}
