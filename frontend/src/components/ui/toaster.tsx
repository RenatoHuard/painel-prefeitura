'use client'

import { useToast } from './use-toast'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts
        .filter((t) => t.open)
        .map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur animate-in slide-in-from-bottom-2 ${
              toast.variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground border-destructive/50'
                : 'bg-card text-card-foreground border-border'
            }`}
            role="status"
          >
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold">{toast.title}</p>
              )}
              {toast.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
    </div>
  )
}
