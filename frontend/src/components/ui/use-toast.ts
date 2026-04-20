'use client'

import * as React from 'react'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 4000

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  open: boolean
}

type State = { toasts: ToastProps[] }

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: { type: string; toast?: Omit<ToastProps, 'id' | 'open'> & { id?: string }; toastId?: string }) {
  if (action.type === 'ADD_TOAST' && action.toast) {
    const id = action.toast.id ?? String(Date.now())
    memoryState = {
      toasts: [{ ...action.toast, id, open: true }, ...memoryState.toasts].slice(0, TOAST_LIMIT),
    }
  } else if (action.type === 'DISMISS_TOAST') {
    memoryState = {
      toasts: memoryState.toasts.map((t) =>
        t.id === action.toastId || !action.toastId ? { ...t, open: false } : t
      ),
    }
    setTimeout(() => {
      memoryState = { toasts: memoryState.toasts.filter((t) => t.open) }
      listeners.forEach((l) => l(memoryState))
    }, TOAST_REMOVE_DELAY)
  }
  listeners.forEach((l) => l(memoryState))
}

export function toast(props: Omit<ToastProps, 'id' | 'open'>) {
  dispatch({ type: 'ADD_TOAST', toast: props })
  const id = String(Date.now())
  setTimeout(() => dispatch({ type: 'DISMISS_TOAST', toastId: id }), TOAST_REMOVE_DELAY)
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id?: string) => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
  }
}
