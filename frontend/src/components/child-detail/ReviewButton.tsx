'use client'

import { useState } from 'react'
import { reviewChild } from '@/lib/api'
import { CheckCircle2, Loader2, ClipboardCheck } from 'lucide-react'

interface Props {
  childId: string
  onReviewed: (revisao: { id: string; tecnico: string; criadoEm: string }) => void
}

export function ReviewButton({ childId, onReviewed }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleReview() {
    setLoading(true)
    setError('')
    try {
      const data = await reviewChild(childId)
      onReviewed(data.revisao)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao registrar revisão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <ClipboardCheck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-card-foreground">Registrar Revisão</h2>
          <p className="text-xs text-muted-foreground">
            Confirma que o caso foi analisado e o acompanhamento está sendo realizado
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          aria-live="polite"
          className="mb-3 px-3 py-2 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Revisão registrada com sucesso!
        </div>
      )}

      <button
        onClick={handleReview}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Marcar caso como revisado"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Marcar como Revisado
          </>
        )}
      </button>
    </div>
  )
}
