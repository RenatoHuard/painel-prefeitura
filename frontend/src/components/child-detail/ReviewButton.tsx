'use client'

import { useState } from 'react'
import { reviewChild } from '@/lib/api'
import { CheckCircle2, Loader2, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base">Registrar Revisão</CardTitle>
            <CardDescription>
              Confirma que o caso foi analisado e o acompanhamento está sendo realizado
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div
            role="alert"
            className="mb-3 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-3 px-3 py-2 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Revisão registrada com sucesso!
          </div>
        )}

        <Button
          onClick={handleReview}
          disabled={loading}
          aria-label="Marcar caso como revisado"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Registrando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Marcar como Revisado
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
