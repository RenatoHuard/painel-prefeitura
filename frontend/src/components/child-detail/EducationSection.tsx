import type { ChildDetail } from '@/types'
import { BookOpen, School, GraduationCap, TrendingUp } from 'lucide-react'
import { NoDados, Alertas } from './HealthSection'

type Props = { educacao: ChildDetail['educacao'] }

function FrequenciaBar({ value }: { value: number }) {
  const color =
    value >= 75
      ? 'bg-green-500'
      : value >= 60
      ? 'bg-amber-500'
      : 'bg-destructive'

  const textColor =
    value >= 75
      ? 'text-green-600 dark:text-green-400'
      : value >= 60
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-destructive'

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">Frequência escolar</p>
        <span className={`text-xs font-semibold ${textColor}`}>{value}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Frequência: ${value}%`}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Mínimo exigido: 75%
        {value < 75 && (
          <span className="text-destructive ml-1">
            (faltam {(75 - value).toFixed(0)}pp)
          </span>
        )}
      </p>
    </div>
  )
}

export function EducationSection({ educacao }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-purple-500" />
        </div>
        <h2 className="font-semibold text-card-foreground">Educação</h2>
        {educacao && educacao.alertas.length > 0 && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs border border-destructive/20">
            {educacao.alertas.length} alerta{educacao.alertas.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!educacao ? (
        <NoDados area="educação" />
      ) : (
        <div className="space-y-3">
          {educacao.escola && (
            <div className="flex items-start gap-2 text-sm">
              <School className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Escola</p>
                <p className="text-card-foreground">{educacao.escola}</p>
              </div>
            </div>
          )}

          {educacao.serie && (
            <div className="flex items-start gap-2 text-sm">
              <GraduationCap className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Série</p>
                <p className="text-card-foreground">{educacao.serie}</p>
              </div>
            </div>
          )}

          {educacao.frequenciaPercentual !== null && educacao.frequenciaPercentual !== undefined && (
            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <FrequenciaBar value={educacao.frequenciaPercentual} />
              </div>
            </div>
          )}

          <Alertas alertas={educacao.alertas} />
        </div>
      )}
    </div>
  )
}
