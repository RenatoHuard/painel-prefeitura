'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getChild } from '@/lib/api'
import type { ChildDetail } from '@/types'
import { HealthSection } from '@/components/child-detail/HealthSection'
import { EducationSection } from '@/components/child-detail/EducationSection'
import { SocialSection } from '@/components/child-detail/SocialSection'
import { ReviewButton } from '@/components/child-detail/ReviewButton'
import { calcularIdade, formatarData, formatarDataHora } from '@/lib/utils'
import { ArrowLeft, MapPin, Phone, User, Loader2, CalendarDays, CheckCircle2 } from 'lucide-react'

export default function ChildDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [child, setChild] = useState<ChildDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getChild(id)
      .then(setChild)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  function handleReviewed(revisao: { id: string; tecnico: string; criadoEm: string }) {
    setChild((prev) =>
      prev
        ? {
            ...prev,
            revisoes: [
              { id: revisao.id, tecnico: revisao.tecnico, nomeTecnico: revisao.tecnico, criadoEm: revisao.criadoEm },
              ...prev.revisoes,
            ],
          }
        : prev
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !child) {
    return (
      <div className="text-center py-24">
        <p className="text-destructive mb-4">{error || 'Criança não encontrada'}</p>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline text-sm"
        >
          Voltar
        </button>
      </div>
    )
  }

  const idade = calcularIdade(child.dataNascimento)
  const totalAlertas = [
    child.saude?.alertas.length ?? 0,
    child.educacao?.alertas.length ?? 0,
    child.assistenciaSocial?.alertas.length ?? 0,
  ].reduce((a, b) => a + b, 0)

  const ultimaRevisao = child.revisoes[0]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        aria-label="Voltar para lista"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </button>

      {/* Child header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary">
                {child.nome.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">{child.nome}</h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {idade} anos · {formatarData(child.dataNascimento)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {child.bairro}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Resp.: {child.responsavel}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {child.telefone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            {totalAlertas > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                ⚠ {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''} ativo{totalAlertas !== 1 ? 's' : ''}
              </span>
            )}
            {ultimaRevisao && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Revisado em {formatarDataHora(ultimaRevisao.criadoEm)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Area sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthSection saude={child.saude} />
        <EducationSection educacao={child.educacao} />
        <SocialSection assistenciaSocial={child.assistenciaSocial} />
      </div>

      {/* Review history */}
      {child.revisoes.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-card-foreground mb-4">Histórico de Revisões</h2>
          <div className="space-y-3">
            {child.revisoes.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{r.tecnico}</p>
                  <p className="text-xs text-muted-foreground">{formatarDataHora(r.criadoEm)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review action */}
      <ReviewButton childId={child.id} onReviewed={handleReviewed} />
    </div>
  )
}
